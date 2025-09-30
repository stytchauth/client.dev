interface MainProps {
  children: React.ReactNode
  className?: string
}

export function Main({ children, className = "" }: MainProps) {
  return (
    <main className={`max-w-4xl mx-auto px-4 pt-16 pb-4 ${className}`}>
      {children}
    </main>
  )
} 