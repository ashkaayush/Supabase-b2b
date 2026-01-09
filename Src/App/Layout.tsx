import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Professional Network',
  description: 'Connect with professionals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
