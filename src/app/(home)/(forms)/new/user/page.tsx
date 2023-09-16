import type { Metadata } from 'next'
import NewUserForm from "./newUser";
 
export const metadata: Metadata = {
  title: "Cadastro"
}

export default function Page(){
    return <NewUserForm />
}