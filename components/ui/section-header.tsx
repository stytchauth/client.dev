interface SectionHeaderProps {
  children: React.ReactNode
  id?: string
  className?: string
}

export function SectionHeader({ children, id, className = "" }: SectionHeaderProps) {
  return (
    <h2 
      id={id}
      className={`text-2xl font-bold ${className}`}
    >
      {children}
    </h2>
  )
} 