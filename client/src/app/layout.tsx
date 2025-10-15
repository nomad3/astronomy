import type { Metadata } from 'next'
import './globals.css'
import ThemeRegistry from './ThemeRegistry'

export const metadata: Metadata = {
  title: 'Space Exploration Dashboard',
  description: 'A comprehensive space exploration data dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}
