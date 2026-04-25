import { idToUuid } from 'notion-utils'
export default function getAllPageIds (collectionQuery, viewId) {
  console.log('[getAllPageIds] collectionQuery type:', typeof collectionQuery, '| is null/undefined:', collectionQuery == null)
  if (collectionQuery != null) {
    const topKeys = Object.keys(collectionQuery)
    console.log('[getAllPageIds] collectionQuery top-level keys:', topKeys)
    topKeys.forEach(k => {
      const views = collectionQuery[k]
      console.log(`[getAllPageIds] collectionQuery["${k}"] type:`, typeof views, '| keys:', views ? Object.keys(views) : 'N/A')
      if (views) {
        Object.keys(views).forEach(vk => {
          const view = views[vk]
          console.log(`[getAllPageIds]   view["${vk}"] keys:`, view ? Object.keys(view) : 'NULL')
          if (view?.blockIds) console.log(`[getAllPageIds]   view["${vk}"].blockIds.length:`, view.blockIds.length)
          if (view?.collection_group_results) console.log(`[getAllPageIds]   view["${vk}"].collection_group_results.blockIds.length:`, view.collection_group_results?.blockIds?.length)
        })
      }
    })
  }
  const views = Object.values(collectionQuery || {})[0]
  console.log('[getAllPageIds] views (first value of collectionQuery):', views == null ? 'NULL/UNDEFINED' : `type=${typeof views} | keys=${Object.keys(views)}`)
  let pageIds = []
  if (viewId) {
    const vId = idToUuid(viewId)
    pageIds = views[vId]?.blockIds
  } else {
    const pageSet = new Set()
    Object.values(views || {}).forEach(view => {
      view?.collection_group_results?.blockIds?.forEach(id => pageSet.add(id))
    })
    pageIds = [...pageSet]
  }
  return pageIds
}
