"use client";

import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

const button_menu = "py-3 px-6 text-left rounded-2xl transition-background text-xs";

export const LoginButton = () => {
  const { status } = useSession();

  if( status !== 'unauthenticated' ){
    return;
  }

  return (
    <button className={ button_menu + " bg-foreground-700 hover:bg-foreground-600" } onClick={() => signIn()}>Login</button>
  );
};

export const RegisterButton = () => {
  const { status } = useSession();

  if( status !== 'unauthenticated' ){
    return;
  }

  return (
    <Link href="/register" className={ button_menu + " bg-primary text-primary-foreground hover:bg-primary-300" }>
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
    <button onClick={() => signOut()} className={ button_menu + " bg-secondary text-secondary-foreground hover:bg-secondary-300" }>
      Logout
    </button>
  );
};

export const ProfileButton = () => {
  const { status } = useSession();

  if( status !== 'authenticated' ){
    return;
  }

  return <Link href="/dashboard/profile" className={ button_menu + " bg-foreground-700 hover:bg-foreground-600" }>Seu perfil</Link>;
};