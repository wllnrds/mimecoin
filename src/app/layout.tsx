import '@/style/globals.scss'

import Script from 'next/script'
import Provider from './providers'

import 'moment/locale/pt-br'
 
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: {
    template: "%s | Mimecoin",
    absolute: "Mimecoin",
  },
  openGraph: {
    images: ['/static/og.png'],
  },
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className='dark'>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-95NEKER5JB" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
  
            gtag('config', 'G-95NEKER5JB');
          `}
        </Script>
        <Provider>
            <div className='h-full flex flex-col'>
              { children }
            </div>
        </Provider>
      </body>
    </html>
  )
}
