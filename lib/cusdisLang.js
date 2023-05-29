const cusdisI18n = [
  'ca',
  'en',
  'es',
  'fi',
  'fr',
  'id',
  'ja',
  'oc',
  'pt-br',
  'tr',
  'zh-cn',
  'zh-tw',
  'ko'
]


export const fetchCusdisLang = lang => {
  const loweredLang = lang.toLowerCase()
  if (loweredLang.startsWith('ko')) {
    return (
      cusdisI18n.find(i => loweredLang === i.toLocaleLowerCase()) ?? 'ko'
    )
  } else {
    return (
      cusdisI18n.find(i =>
        loweredLang.startsWith(i.toLowerCase())
      ) ?? 'en'
    )
  }
}
