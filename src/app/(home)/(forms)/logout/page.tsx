import type { Metadata } from 'next'
import LogoutPage from "./logout";
 
export const metadata: Metadata = {
  title: "Logout"
}

export default function Page(){
    return <LogoutPage></LogoutPage>
}