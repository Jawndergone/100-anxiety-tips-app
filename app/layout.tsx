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
        background: 'linear-gradient(135deg, #FFF9E6 0%, #FFEEF4 50%, #FFB6D9 100%)',
        minHeight: '100vh'
      }}>
        {children}
      </body>
    </html>
  )
}
