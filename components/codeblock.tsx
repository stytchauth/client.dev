import { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'

async function highlight(code: string, lang: string = 'typescript', theme: string = 'one-light') {
  return await codeToHtml(code, {
    lang,
    theme
  })
}

export function CodeBlock({ children, language = 'typescript', theme = 'one-light' }: { children: string, language?: string, theme?: string }) {
  const [html, setHtml] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    highlight(children, language, theme)
      .then(setHtml)
      .finally(() => setIsLoading(false))
  }, [children, language, theme])

  if (isLoading) {
    return (
      <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
        <pre className="text-sm font-mono text-gray-600">{children}</pre>
      </div>
    )
  }

  return (
    <div
      className="bg-gray-50 p-4 rounded-md overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
