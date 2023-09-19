'use client';

import { redirect } from "next/navigation";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import { CreateUser } from "./action";

export default function NewUserForm(){
    const { data: session } = useSession()

    if( session ){
        return redirect('/dashboard')
    }

    let [ loading, setLoading ] = useState( false );
    let [ error, setError ] = useState< string | null >( null );

    async function handleSubmit(formdata : FormData){
        const res : any = await CreateUser( formdata ).finally( () => setLoading( false ) )

        if(res?.error){
            setError( res?.error )
        }else{
            signIn('credentials', { email: formdata.get('email'), password: formdata.get('password'), redirect: false, callbackUrl: '/new/mime' })
        }
    }

    return <div className="max-w-sm w-full flex-1 m-auto p-4 flex flex-col">
        <form action={ handleSubmit } onSubmit={ () => setLoading( true ) } className="flex-1 flex flex-col bg-white rounded-[2rem] overflow-clip">
            <div className="flex flex-col p-8 gap-4">
                <div className="flex flex-col gap-6 items-center">
                    <h2 className="text-[2rem] font-black uppercase">Novo Mime</h2>
                </div>
                <div className="flex flex-col gap-4 mt-8">
                    <div className="flex-1 flex flex-col gap-2">
                        <input placeholder="Nome completo" name="name" required  className="bg-white w-full border py-2 px-3 rounded-[12px] outline-none focus:outline-2 focus:outline-secondary" />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <input placeholder="Email" type="email" name="email" required  className="bg-white w-full border py-2 px-3 rounded-[12px] outline-none focus:outline-2 focus:outline-secondary" />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <input placeholder="Senha" type="password" required  name="password" className="bg-white w-full border py-2 px-3 rounded-[12px] outline-none focus:outline-2 focus:outline-secondary" />
                    </div>
                    { error && <div className="bg-danger p-3 text-white">{ error }</div> }
                </div>
            </div>
            <div className="bg-primary flex flex-row justify-end rounded-[2rem] m-2">
                { loading && <div className="flex h-[4rem] w-[4rem] items-center justify-center bg-primary-500 rounded-[2rem]"><span className="material-icon text-2xl animate-spin">progress_activity</span></div>}
                { !loading && <button className="h-[4rem] rounded-[2rem] flex items-center justify-center gap-2 py-2 pl-6  pr-3 hover:bg-primary-500 uppercase">Criar conta <span className="material-icon text-xl">arrow_forward</span></button> }
            </div>
            <div className="px-8">
                <p className="text-center">Criando sua conta <strong>Mimecoin</strong> você concorda com os <Link href="/terms" className="text-secondary">Termos de Serviço</Link> e <Link href="#" className="text-secondary">Política de Privacidade</Link>.</p>
            </div>
        </form>
    </div>
}