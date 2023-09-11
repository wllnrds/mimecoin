'use client';

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function Page(){
    const { data: session } = useSession()

    if( session ){
        return redirect('/dashboard')
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>){
    }

    return <div className="max-w-sm w-full flex-1 m-auto p-4 flex flex-col">
        <section className="flex-1 flex flex-col bg-white rounded-[2rem] overflow-clip">
            <div className="flex flex-col p-8 gap-4">
                <div className="flex flex-col gap-6 items-center">
                    <h2 className="text-[2rem] font-black uppercase">Login</h2>
                </div>
                <div className="flex flex-col gap-4 mt-8">
                    <div className="flex-1 flex flex-col gap-2">
                        <input placeholder="Email" onChange={ handleChange } autoComplete="off" name="email" className="bg-white w-full border py-2 px-3 rounded-[12px] outline-none focus:outline-2 focus:outline-secondary" />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <input placeholder="Senha" onChange={ handleChange } type="password" name="password" className="bg-white w-full border py-2 px-3 rounded-[12px] outline-none focus:outline-2 focus:outline-secondary" />
                    </div>
                </div>
            </div>
            <div className="bg-primary flex flex-row justify-end rounded-[2rem] m-2">
                <button className="h-[4rem] rounded-[2rem] flex items-center justify-center gap-2 py-2 pl-6  pr-3 hover:bg-primary-500 uppercase">Entrar <span className="material-icon text-xl">arrow_forward</span></button>
            </div>
        </section>
    </div>
}