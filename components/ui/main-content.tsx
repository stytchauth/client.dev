interface MainContentProps {
  children: React.ReactNode
  className?: string
}

export function MainContent({ children, className = "" }: MainContentProps) {
  return (
    <main className={`max-w-4xl mx-auto px-4 py-16 ${className}`}>
      {children}
    </main>
  )
} 