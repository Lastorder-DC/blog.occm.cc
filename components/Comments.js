import 'gitalk/dist/gitalk.css'
import { useEffect, useLayoutEffect } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import cn from 'classnames'
import { fetchCusdisLang } from '@/lib/cusdisLang'
import { useConfig } from '@/lib/config'

const GitalkComponent = dynamic(
  () => {
    return import('gitalk/dist/gitalk-component')
  },
  { ssr: false }
)
const UtterancesComponent = dynamic(
  () => {
    return import('@/components/Utterances')
  },
  { ssr: false }
)
const CusdisComponent = dynamic(
  () => {
    return import('react-cusdis').then(m => m.ReactCusdis)
  },
  { ssr: false }
)

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

const parkCusdisIframe = () => {
  const thread = document.getElementById('cusdis_thread')
  const iframe = thread?.querySelector('iframe')

  if (!iframe) return

  let parkingElement = document.getElementById('cusdis_parking')

  if (!parkingElement) {
    parkingElement = document.createElement('div')
    parkingElement.id = 'cusdis_parking'
    parkingElement.hidden = true
    document.body.appendChild(parkingElement)
  }

  parkingElement.appendChild(iframe)
}

const SafeCusdis = props => {
  useIsomorphicLayoutEffect(() => {
    return () => {
      parkCusdisIframe()
    }
  }, [])

  return <CusdisComponent {...props} />
}

const Comments = ({ frontMatter }) => {
  const router = useRouter()
  const BLOG = useConfig()

  const fullWidth = frontMatter.fullWidth ?? false

  return (
    <div
      className={cn(
        'px-4 font-medium text-gray-500 dark:text-gray-400 my-5',
        fullWidth ? 'md:px-24' : 'mx-auto max-w-2xl',
      )}
    >
      {BLOG.comment && BLOG.comment.provider === 'gitalk' && (
        <GitalkComponent
          options={{
            id: frontMatter.id,
            title: frontMatter.title,
            clientID: BLOG.comment.gitalkConfig.clientID,
            clientSecret: BLOG.comment.gitalkConfig.clientSecret,
            repo: BLOG.comment.gitalkConfig.repo,
            owner: BLOG.comment.gitalkConfig.owner,
            admin: BLOG.comment.gitalkConfig.admin,
            distractionFreeMode: BLOG.comment.gitalkConfig.distractionFreeMode
          }}
        />
      )}
      {BLOG.comment && BLOG.comment.provider === 'utterances' && (
        <UtterancesComponent issueTerm={frontMatter.id} />
      )}
      {BLOG.comment && BLOG.comment.provider === 'cusdis' && (
        <SafeCusdis
          key={frontMatter.id}
          lang={fetchCusdisLang(BLOG.lang)}
          attrs={{
            host: BLOG.comment.cusdisConfig.host,
            appId: BLOG.comment.cusdisConfig.appId,
            pageId: frontMatter.id,
            pageTitle: frontMatter.title,
            pageUrl: BLOG.link + router.asPath,
            theme: BLOG.appearance
          }}
        />
      )}
    </div>
  )
}

export default Comments
