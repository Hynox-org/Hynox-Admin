"use client"

import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { SidebarNav } from '@/components/sidebar-nav'
import { usePathname } from 'next/navigation'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const showSidebar = pathname !== '/login'

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex">
            {/* {showSidebar && <SidebarNav />} */}
            <main className="flex-1">{children}</main>
          </div>
          <Analytics />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
