'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";

import { ButtonLink } from "@/components/button.component";

export default function HeaderMenu() {
  const [ active , setStatus ] = useState( false );

  return <div className={ `flex flex-col gap-3 relative ${ active ? 'bg-primary' : '' }` }>
    <div className="flex flex-col gap-3 pt-10 px-4 sm:px-10">
      <aside className="flex flex-col sm:flex-row gap-3 items-center px-[20px]">
        <h1>
          <Image src={ active ? '/assets/logo-white.svg' : '/assets/logo.svg' } 
            sizes="100vw"
            alt="Minecoin"
            width={ 130 }
            height={ 30 }
            style={{
              width: 'auto',
              height: '100%'
            }} />
        </h1>
        <div className="flex-1"></div>
        <div className="flex flex-row gap-1 md:gap-3 flex-wrap">
          <button className={ `py-3 px-5 flex text-left rounded-full transition-background text-xs text-primary-foreground ${ active ? 'bg-primary hover:bg-primary-500' : 'hover:bg-foreground-700' }` } onClick={() => signIn('email', { callbackUrl : '/dashboard' })}>Login</button>
          <ButtonLink auth="all" href="/dashboard" style={ active ? 'bg-foreground-900 hover:bg-foreground-700' : 'bg-primary hover:bg-primary-500' }>criar seu mime</ButtonLink>
          <button onClick={ () => setStatus( !active ) } className={ `py-3 px-5 flex text-left rounded-full transition-background text-xs text-primary-foreground bg-primary hover:bg-primary-500` }>
            <span className="material-icon">{ active ? 'close' : 'star' }</span>
          </button>
        </div>
      </aside>
    </div>
    { active && <div className="absolute top-[100%] w-full flex flex-row flex-nowrap bg-primary p-10 z-50 gap-6 md:justify-center overflow-x-auto">
      <Feat title="banco completo" details="transferência entre contas, depósito, transferência e transações" />
      <Feat title="conta digital" details="cada usuário do seu banco tem sua própria conta digital" />
      <Feat title="gerencie os recursos" details="você decide o que seu usuário pode fazer" />
      <Feat title="emissão individual" details="cunhe tokens da forma que preferir" />
      <Feat title="ready to play" details="crie apps sem necessidade de backend" />
    </div>}
  </div>;
}

function Feat({ title, details, link }: { title: string, details: string, link?: string }){
  return <div className="flex flex-col p-6 bg-foreground-900 aspect-[192/270] w-48 rounded-[2.5rem] transition-background hover:bg-primary-500 gap-3 shrink-0">
    <div className="text-xl sm:text-2xl font-black leading-none">{ title }</div>
    <div className="text-sm leading-normal font-light">{ details }</div>
    { link ? <Link href={link}>ver mais</Link> : <></> }
  </div>
}