'use client'

import React from 'react'
import { codeToHtml } from 'shiki'

export async function highlight(code: string, lang: string = 'typescript', theme: string = 'one-light') {
  return await codeToHtml(code, {
    lang,
    theme
  })
}

export function CodeBlock({ children, language = 'typescript', theme = 'one-light' }: { children: string, language?: string, theme?: string }) {
  const [html, setHtml] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    setIsLoading(true)
    highlight(children, language, theme)
      .then(setHtml)
      .finally(() => setIsLoading(false))
  }, [children, language, theme])

  if (isLoading) {
    return React.createElement('div', {
      className: "bg-gray-50 p-4 rounded-md overflow-x-auto"
    }, React.createElement('pre', {
      className: "text-sm font-mono text-gray-600"
    }, children))
  }

  return React.createElement('div', {
    className: "bg-gray-50 p-4 rounded-md overflow-x-auto",
    dangerouslySetInnerHTML: { __html: html }
  })
} 