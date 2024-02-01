"use client";

import { Suspense, useCallback } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const button_menu = "py-3 px-6 text-left rounded-2xl transition-background text-xs";

export const LoginButton = () => {
  const { status } = useSession();

  if( status !== 'unauthenticated' ){
    return;
  }
  
  return <Link href="/login" className={ button_menu + " bg-primary text-primary-foreground hover:bg-primary-300" } prefetch={ false }>Login</Link>
};


export const RegisterButton = () => {
  const { status } = useSession();

  if( status !== 'unauthenticated' ){
    return;
  }

  return (
    <Link href="/register" className={ button_menu + " bg-primary text-primary-foreground hover:bg-primary-300" } prefetch={ false }>
      Cadastrar-se
    </Link>
  );
};

export const LogoutButton = () => {
  const { status } = useSession();

  if( status !== 'authenticated' ){
    return;
  }

  return (
    <button onClick={() => signOut()} className={ button_menu + " bg-primary text-primary-foreground hover:bg-primary-300" }>
      Logout
    </button>
  );
};

export const AccountButton = () => {
  return <MenuLink auth="authenticated" href="/dashboard/accounts">Contas</MenuLink>;
};

export const DashboardButton = () => {
  return <MenuLink auth="authenticated" href="/dashboard">Dashboard</MenuLink>;
};

export const SettingsButton = () => {
  return <MenuLink auth="authenticated" href="/dashboard/settings">Configurações</MenuLink>;
};

export function MenuLink({ href, auth, children } : { href : string | any, auth : 'authenticated' | 'unauthenticated' | 'all', children : React.ReactNode }){
  const pathname = usePathname()
  const { status } = useSession();

  const searchParams = useSearchParams()!

  const createQueryString = useCallback( (name?: string, value?: string) => {
      const params = new URLSearchParams(searchParams as any)
        if( name && value ){
          params.set(name, value)
        }
        return params.toString()
      },
      [searchParams]
  )

  if( auth !== 'all'){
    if( status != auth ){
      return;
    }
  }

  const active : boolean = pathname.toLowerCase() == href.toLowerCase();

  return <Link href={ href + "?" + createQueryString() } className={ `py-3 px-6 text-left rounded-2xl transition-background text-xs hover:bg-foreground-700 ${ active ? ' bg-foreground-700 cursor-default' : '' }` } prefetch={ true }>{ children }</Link>
}

export function ButtonLink( { href, auth, children, style = 'hover:bg-foreground-700', target, event } : { href? : string | any, auth : 'authenticated' | 'unauthenticated' | 'all', children : React.ReactNode, style? : string, target?: string, event?: any | null } ){
  const { status } = useSession();
  const searchParams = useSearchParams()!

  const createQueryString = useCallback( (name?: string, value?: string) => {
      const params = new URLSearchParams(searchParams as any)
        if( name && value ){
          params.set(name, value)
        }
        return params.toString()
      },
      [searchParams]
  )

  if( auth !== 'all'){
    if( status != auth ){
      return;
    }
  }

  function callback(){
    if( event && event.name && event.body ){
      gtag('event', event.name, event.body )
    }
  }

  return <Link onClick={ () => callback() } href={ href + "?" + createQueryString() } target={ target } className={ `py-3 px-5 flex text-left rounded-full transition-background text-xs text-primary-foreground ${ style }` } prefetch={ false }>{ children }</Link>
}