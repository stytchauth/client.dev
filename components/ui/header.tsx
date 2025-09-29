import Link from "next/link"
import { AlertCircle } from "lucide-react"

interface HeaderProps {
  currentPage?: string
}

export function Header({ currentPage }: HeaderProps) {
  return (
    <>
      {/* IETF Draft Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <p className="text-amber-800">
            <strong>Note:</strong> CIMD is currently an{' '}
            <Link
              href="https://datatracker.ietf.org/doc/draft-parecki-oauth-client-id-metadata-document/"
              target="_blank"
              className="underline hover:text-amber-900"
            >
              IETF Internet-Draft
            </Link>
            . Specifications may change before final adoption.
          </p>
        </div>
      </div>

      <header className="border-b border-gray-200 px-4 py-4 z-50 relative bg-white">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="hover:opacity-80">
              <span className="text-xl font-bold">Client ID Metadata Documents</span>
            </Link>
            {currentPage && (
              <span className="text-sm text-gray-500 hidden md:inline">/{currentPage}</span>
            )}
          </div>
          <nav className="flex items-center space-x-2 md:space-x-6">
            <Link
              href="/clients"
              className={`text-sm ${currentPage === 'clients' ? 'font-bold' : 'hover:underline'}`}
            >
              for clients
            </Link>
            <Link
              href="/servers"
              className={`text-sm ${currentPage === 'servers' ? 'font-bold' : 'hover:underline'}`}
            >
              for servers
            </Link>
          </nav>
        </div>
      </header>
    </>
  )
}
