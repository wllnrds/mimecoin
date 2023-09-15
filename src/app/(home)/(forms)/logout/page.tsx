'use client';

import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Page(){
    const { data: session } = useSession()

    if( !session ){
        return redirect('/login')
    }

    signOut();

    return <></>
}