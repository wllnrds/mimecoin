'use client';

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Header() {
    const { data: session } = useSession()

    return <div className="max-w-7xl w-full m-auto flex flex-col p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center px-[20px]">
            <h1>
                <Image src={ '/assets/logo-white.svg' } 
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
            <div>
            {
                session ? 
                <Link href="/dashboard" className={ `py-3 px-5 flex text-left rounded-full transition-background text-xs text-primary-foreground bg-white hover:bg-primary-50` }>dashboard</Link> : 
                <Link href="/login" className={ `py-3 px-5 flex text-left rounded-full transition-background text-xs text-primary-foreground bg-white hover:bg-primary-50' }` }>Login</Link>
            }
            </div>
        </div>
    </div>
}