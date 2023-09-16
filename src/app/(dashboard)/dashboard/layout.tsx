import { Dashboard } from '@/components/dashboard';

import 'moment/locale/pt-br';

export default async function Home({ children }: { children: React.ReactNode }) {
  return <Dashboard>{ children }</Dashboard>
}