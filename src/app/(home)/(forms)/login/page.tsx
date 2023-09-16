import { Metadata } from 'next'
import LoginForm from './login'
 
export const metadata: Metadata = {
  title: "Login",
  description: "Login page on Mimecoin"
}

export default function Page(){
    return <LoginForm />
}