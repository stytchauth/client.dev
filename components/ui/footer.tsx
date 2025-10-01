'use client'

import { PresentedByStytch } from "./stytch";

export function Footer() {
  return (
    <footer className="bg-[rgb(178,214,222)] border-t border-gray-200 mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex flex-col space-y-1">
            <PresentedByStytch />
          </div>
          <div className="flex items-center space-x-4">
            <span>© 2025 Stytch. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  )
} 