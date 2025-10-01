import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { PresentedByStytch } from "./stytch"

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
              href="/servers"
              className={`text-sm ${currentPage === 'servers' ? 'font-bold' : 'hover:underline'}`}
            >
              for servers
            </Link>
            <Link
              href="/clients"
              className={`text-sm ${currentPage === 'clients' ? 'font-bold' : 'hover:underline'}`}
            >
              for clients
            </Link>

            {/* <Link
              href="https://stytch.com?utm_source=cimd.dev"
              target="_blank"
              className="text-sm hover:underline"
            >
              <svg fill="none" height="20" viewBox="0 0 280 89" width="63.84269662921349" xmlns="http://www.w3.org/2000/svg"><path d="M16.0023 19.1967C16.0023 24.6088 18.2913 27.0809 24.7411 28.617L24.7309 28.6272L33.1746 30.672C45.596 33.724 51.1404 39.8278 51.1404 50.4486C51.1404 64.6605 41.4657 72.8092 25.7787 72.8092C10.0918 72.8092 1.18008 65.6168 0 51.9847H13.5811C14.4459 58.8313 18.7288 62.3003 25.7787 62.3003C32.8287 62.3003 37.3863 58.4854 37.3863 52.585C37.3863 47.0203 34.5683 44.2226 27.3556 42.6051L18.8305 40.6519C11.2617 38.841 2.24826 33.9376 2.24826 20.7837C2.24826 8.35215 11.7805 0 25.9619 0C41.2216 0 49.1261 6.06319 50.1027 18.5151H35.962C35.2906 13.0114 31.9538 10.3257 25.7787 10.3257C20.0207 10.3257 16.0023 13.7846 16.0023 19.1967Z" fill="#1D1D1D"></path><path d="M214.479 36.8772C213.472 31.7194 210.135 29.3185 204.031 29.3185H203.146C195.13 29.3185 189.941 35.6462 189.941 45.4226C189.941 55.199 195.12 61.5267 203.146 61.5267H204.031C210.135 61.5267 213.462 59.1258 214.479 53.968H227.826C226.595 66.1148 218.009 72.7884 203.594 72.7884C188.324 72.7884 177.663 61.5369 177.663 45.4226C177.663 29.3083 188.324 18.0569 203.594 18.0569C218.009 18.0569 226.595 24.7406 227.826 36.8772H214.479Z" fill="#1D1D1D"></path><path d="M161.62 54.9044V28.9833H175.761V17.9963H166.574C163.838 17.9963 161.61 15.7887 161.61 13.0827V0H148.151V18.0065H136.95C132.23 18.0065 127.977 20.8346 126.126 25.2192L114.488 52.7986L102.077 24.9954C100.184 20.743 95.9727 17.9963 91.3541 17.9963H75.2399C72.5033 17.9963 70.2754 15.7887 70.2754 13.0827V0H56.8163V58.8109C56.8163 67.9566 61.6486 72.799 70.784 72.799H83.5717V61.5475H76.9083C71.6386 61.5475 70.2754 60.1843 70.2754 54.9044V28.9833H86.6847C88.2005 28.9833 89.3195 29.6038 89.8485 30.7127L107.957 68.8823V71.6877C107.957 77.0693 106.471 77.3033 101.324 77.3033H84.416V88.7582H106.777C115.393 88.7582 120.744 82.6238 120.744 72.7559L120.795 68.2313L138.161 30.7432C138.69 29.6038 139.819 28.9833 141.345 28.9833H148.141V58.8008C148.141 67.9464 152.973 72.7888 162.108 72.7888H175.283V61.5373H168.233C162.963 61.5373 161.6 60.1741 161.6 54.8943L161.62 54.9044Z" fill="#1D1D1D"></path><path d="M246.805 25.2396L247.71 24.1307H247.7C250.844 20.2954 254.038 18.0675 261.129 18.0675C273.113 18.0675 280 25.5956 280 38.7393V72.799H266.541V40.4179C266.541 36.3486 265.381 33.1136 263.184 31.0484C261.414 29.38 259.033 28.5967 256.307 28.7595C249.826 29.1664 246.805 34.2021 246.805 44.6296V72.799H233.346V0H246.805V25.2396Z" fill="#1D1D1D"></path></svg>
            </Link> */}

            {/* <PresentedByStytch /> */}
          </nav>
        </div>
      </header>
    </>
  )
}
