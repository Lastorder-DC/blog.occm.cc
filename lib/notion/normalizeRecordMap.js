/**
 * Normalize Notion API record map to handle the nested value structure.
 *
 * The Notion API sometimes returns records wrapped in an extra layer:
 *   { value: { value: { id, type, ... }, role: 'reader' } }
 * instead of the expected:
 *   { value: { id, type, ... } }
 *
 * This function unwraps the nested structure so that all downstream code
 * can consistently access record.value.* properties.
 *
 * @see https://github.com/NotionX/react-notion-x/issues/681
 */
function normalizeRecordValue (record) {
  if (record?.value?.value && record?.value?.role) {
    return { ...record, value: record.value.value }
  }
  return record
}

export function normalizeRecordMap (recordMap) {
  if (!recordMap) return recordMap

  if (recordMap.block) {
    for (const id of Object.keys(recordMap.block)) {
      recordMap.block[id] = normalizeRecordValue(recordMap.block[id])
    }
  }

  if (recordMap.collection) {
    for (const id of Object.keys(recordMap.collection)) {
      recordMap.collection[id] = normalizeRecordValue(recordMap.collection[id])
    }
  }

  if (recordMap.collection_view) {
    for (const id of Object.keys(recordMap.collection_view)) {
      recordMap.collection_view[id] = normalizeRecordValue(recordMap.collection_view[id])
    }
  }

  return recordMap
}
