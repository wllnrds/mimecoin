'use client'

import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from '@nextui-org/react'

export default function Provider({children}: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <SessionProvider>
        {children}
      </SessionProvider>
    </NextUIProvider>
  )
}