import '@/style/globals.scss'
import type { Metadata } from 'next'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Mimecoin',
  description: 'Token as a Service',
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className='dark'>
        <Providers>
            { children }
        </Providers>
      </body>
    </html>
  )
}
