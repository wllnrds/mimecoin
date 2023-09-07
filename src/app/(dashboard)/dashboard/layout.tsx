import type { Metadata } from 'next'
import { Dashboard } from '@/components/dashboard';

import 'moment/locale/pt-br';
 
export const metadata: Metadata = {
  title: {
    template: "%s | Mimecoin",
    absolute: "Mimecoin",
    default: "Dashboard"
  }
}

export default async function Home({ children }: { children: React.ReactNode }) {
  return <Dashboard>{ children }</Dashboard>
}