import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '100 Anxiety Tips',
  description: 'Get personalized anxiety tips based on what you\'re feeling',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#f0f4f8',
        minHeight: '100vh'
      }}>
        {children}
      </body>
    </html>
  )
}
