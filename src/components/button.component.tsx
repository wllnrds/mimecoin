"use client";

import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from 'next/navigation'

const button_menu = "py-3 px-6 text-left rounded-2xl transition-background text-xs";

export const LoginButton = () => {
  const { status } = useSession();

  if( status !== 'unauthenticated' ){
    return;
  }

  return <button className={ button_menu + " hover:bg-foreground-600" } onClick={() => signIn()}>Login</button>;
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

  if( auth !== 'all'){
    if( status != auth ){
      return;
    }
  }

  const active : boolean = pathname.toLowerCase() == href.toLowerCase();

  return <Link href={ href } className={ `py-3 px-6 text-left rounded-2xl transition-background text-xs hover:bg-foreground-700 ${ active ? ' bg-foreground-700 cursor-default' : '' }` } prefetch={ true }>{ children }</Link>
}

export function ButtonLink( { href, auth, children, style = 'hover:bg-foreground-700', target } : { href? : string | any, auth : 'authenticated' | 'unauthenticated' | 'all', children : React.ReactNode, style? : string, target?: string } ){
  const { status } = useSession();

  if( auth !== 'all'){
    if( status != auth ){
      return;
    }
  }

  return <Link href={ href } target={ target } className={ `py-3 px-5 flex text-left rounded-full transition-background text-xs text-primary-foreground ${ style }` } prefetch={ false }>{ children }</Link>
}