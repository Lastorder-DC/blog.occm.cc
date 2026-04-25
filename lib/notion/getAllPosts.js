import { config as BLOG } from '@/lib/server/config'

import { idToUuid } from 'notion-utils'
import dayjs from 'dayjs'
import api from '@/lib/server/notion-api'
import getAllPageIds from './getAllPageIds'
import getPageProperties from './getPageProperties'
import filterPublishedPosts from './filterPublishedPosts'
import { normalizeRecordMap } from './normalizeRecordMap'

/**
 * @param {{ includePages: boolean }} - false: posts only / true: include pages
 */
export async function getAllPosts ({ includePages = false }) {
  const id = idToUuid(process.env.NOTION_PAGE_ID)
  const rawResponse = await api.getPage(id)
  console.log('[getAllPosts] raw API response top-level keys:', Object.keys(rawResponse || {}))
  console.log('[getAllPosts] response.collection present:', !!rawResponse?.collection)
  console.log('[getAllPosts] response.collection_query present:', !!rawResponse?.collection_query)
  console.log('[getAllPosts] response.block present:', !!rawResponse?.block)
  if (rawResponse?.collection) {
    const collKeys = Object.keys(rawResponse.collection)
    console.log('[getAllPosts] collection keys:', collKeys)
    collKeys.forEach(k => {
      const entry = rawResponse.collection[k]
      console.log(`[getAllPosts] collection["${k}"] shape:`, JSON.stringify({
        hasValue: !!entry?.value,
        hasValueValue: !!entry?.value?.value,
        hasRole: !!entry?.value?.role,
        topLevelKeys: Object.keys(entry || {})
      }))
    })
  }
  if (rawResponse?.collection_query) {
    const cqKeys = Object.keys(rawResponse.collection_query)
    console.log('[getAllPosts] collection_query keys:', cqKeys)
    cqKeys.forEach(k => {
      const views = rawResponse.collection_query[k]
      console.log(`[getAllPosts] collection_query["${k}"] view keys:`, Object.keys(views || {}))
      Object.keys(views || {}).forEach(vk => {
        const view = views[vk]
        console.log(`[getAllPosts] collection_query["${k}"]["${vk}"] keys:`, Object.keys(view || {}))
        if (view?.blockIds) console.log(`[getAllPosts]   blockIds count:`, view.blockIds.length)
        if (view?.collection_group_results) console.log(`[getAllPosts]   collection_group_results.blockIds count:`, view.collection_group_results?.blockIds?.length)
      })
    })
  }

  const response = normalizeRecordMap(rawResponse)

  const collection = Object.values(response.collection || {})[0]?.value
  const collectionQuery = response.collection_query
  const block = response.block
  const schema = collection?.schema
  const rawMetadata = block[id].value

  console.log('[getAllPosts] collection after normalize:', collection ? `type=${rawMetadata?.type}, schema keys=${Object.keys(collection.schema || {}).length}` : 'UNDEFINED/NULL')
  console.log('[getAllPosts] collectionQuery after normalize:', collectionQuery ? `keys=${Object.keys(collectionQuery)}` : 'UNDEFINED/NULL')

  // Check Type - if the page itself is not a database,
  // look for a child collection_view block within the page
  if (
    rawMetadata?.type !== 'collection_view_page' &&
    rawMetadata?.type !== 'collection_view'
  ) {
    const childBlocks = rawMetadata?.content
    const hasChildCollectionView = childBlocks?.some(
      childId => block[childId]?.value?.type === 'collection_view'
    )
    if (!hasChildCollectionView) {
      console.log(`pageId "${id}" is not a database and contains no child database`)
      return []
    }
  }

  // Construct Data
  const pageIds = getAllPageIds(collectionQuery)
  const data = []
  for (let i = 0; i < pageIds.length; i++) {
    const id = pageIds[i]
    const properties = (await getPageProperties(id, block, schema)) || null

    // Add fullwidth to properties
    properties.fullWidth = block[id].value?.format?.page_full_width ?? false
    // Convert date (with timezone) to unix milliseconds timestamp
    properties.date = (
      properties.date?.start_date
        ? dayjs.tz(properties.date?.start_date)
        : dayjs(block[id].value?.created_time)
    ).valueOf()

    data.push(properties)
  }

  // remove all the the items doesn't meet requirements
  const posts = filterPublishedPosts({ posts: data, includePages })

  // Sort by date
  if (BLOG.sortByDate) {
    posts.sort((a, b) => b.date - a.date)
  }
  return posts
}
