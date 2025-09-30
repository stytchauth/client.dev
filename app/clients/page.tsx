'use client'

import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileText, Search } from "lucide-react"
import { PresentedByStytch } from '@/components/ui/stytch';
import { Header } from '@/components/ui/header';
import { LearnContent } from './tablearn';
import { ExploreContent } from './tabexplore';
import { Main } from "@/components/ui/main";

export default function ClientsPage() {
  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      <Header />

      {/* Main Content */}
      <Main>
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold">CIMD for Clients</h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Learn how to create and host Client ID Metadata Documents for your OAuth applications.
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="learn" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="learn" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Learn</span>
              </TabsTrigger>
              <TabsTrigger value="explore" className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Explore</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="learn" className="mt-8">
              <LearnContent />
            </TabsContent>

            <TabsContent value="explore" className="mt-8">
              <ExploreContent />
            </TabsContent>
          </Tabs>

          <div className="mt-16">
            <PresentedByStytch />
          </div>
        </div>
      </Main>
    </div>
  )
}