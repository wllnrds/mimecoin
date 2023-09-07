import '@/style/globals.scss'

import Provider from './providers'
import type { Metadata } from 'next'
import 'moment/locale/pt-br';
 
export const metadata: Metadata = {
  title: "Mimecoin"
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className='dark'>
        <Provider>
            <div className='h-full flex flex-col'>
              { children }
            </div>
        </Provider>
      </body>
    </html>
  )
}
