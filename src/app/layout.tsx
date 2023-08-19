import '@/style/globals.scss'

import type { Metadata } from 'next'
import Provider from './providers'

export const metadata: Metadata = {
  title: 'Mimecoin',
  description: 'Token as a Service',
}

import * as moment from 'moment';
import 'moment/locale/pt-br';

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className='dark'>
        <Provider>
            <div className='h-full flex flex-col'>
              <div></div>
              { children }
            </div>
        </Provider>
      </body>
    </html>
  )
}
