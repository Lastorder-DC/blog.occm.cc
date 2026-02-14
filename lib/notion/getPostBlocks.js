import api from '@/lib/server/notion-api'
import { normalizeRecordMap } from './normalizeRecordMap'

export async function getPostBlocks (id) {
  const pageBlock = normalizeRecordMap(await api.getPage(id))
  return pageBlock
}
