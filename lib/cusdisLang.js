import BLOG from '@/blog.config'

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

const loweredLang = BLOG.lang.toLowerCase()

export const fetchCusdisLang = () => {
  if (BLOG.comment.provider !== 'cusdis') return null
  if (loweredLang.startsWith('ko')) {
    return (
      cusdisI18n.find(i => loweredLang === i.toLocaleLowerCase()) ?? 'ko'
    )
  } else {
    return (
      cusdisI18n.find(i =>
        BLOG.lang.toLowerCase().startsWith(i.toLowerCase())
      ) ?? 'en'
    )
  }
}
