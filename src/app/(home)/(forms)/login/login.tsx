'use client';

import { ChangeEvent, FormEvent, useState } from "react";
import { redirect } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function LoginForm(){
    const { data: session } = useSession()
    const [ loading, setLoading ] = useState< boolean >(false);
    const [ error, setError ] = useState< string | null >( null );
    const [ identity, setIdentity ] = useState< { email: string, password: string } >({ email: "", password: "" }) 

    if( session ){
        redirect('/dashboard')
    }

    async function handleChange( event : ChangeEvent<HTMLInputElement> ){
        const name = event.target.name
        const value = event.target.value
        setIdentity({ ...identity, [name]: value });
    }

    async function login( event: FormEvent<HTMLFormElement> ){
        event.preventDefault();
        setLoading( true )
        setError( '' )

        try {
            const result = await signIn('credentials', { ...identity, redirect: false });
            if( !result?.error && result?.ok )
            redirect('/dashboard')
        } catch (error : any ) {
            console.error( error );
            setError( "Login e/ou senha inválidos." )
        }

        setLoading( false )
    }

    return <div className="max-w-sm w-full flex-1 m-auto p-4 flex flex-col">
        <form onSubmit={ login } className="flex-1 flex flex-col bg-white rounded-[2rem] overflow-clip">
            <div className="flex flex-col p-8 gap-4">
                <div className="flex flex-col gap-6 items-center">
                    <h2 className="text-[2rem] font-black uppercase">Login</h2>
                </div>
                <div className="flex flex-col gap-4 mt-8">
                    <label className="flex-1 flex flex-col gap-2">
                        <input placeholder="Email" type="email" defaultValue={ identity.email } onChange={ handleChange } required name="email" className="bg-white w-full border py-2 px-3 rounded-[12px] outline-none focus:outline-2 focus:outline-secondary" />
                    </label>
                    <label className="flex-1 flex flex-col gap-2">
                        <input placeholder="Senha" defaultValue={ identity.password } onChange={ handleChange } required type="password" name="password" className="bg-white w-full border py-2 px-3 rounded-[12px] outline-none focus:outline-2 focus:outline-secondary" />
                    </label>
                    { error && <div className="bg-danger p-3 text-white">{ error }</div> }
                </div>
            </div>
            <div className="bg-primary flex flex-row justify-end rounded-[2rem] m-2">
                { loading && <div className="flex h-[4rem] w-[4rem] items-center justify-center bg-primary-500 rounded-[2rem]"><span className="material-icon text-2xl animate-spin">progress_activity</span></div>}
                { !loading && <button className="h-[4rem] rounded-[2rem] flex items-center justify-center gap-2 py-2 pl-6  pr-3 hover:bg-primary-500 uppercase">Entrar <span className="material-icon text-xl">arrow_forward</span></button> }
            </div>
        </form>
    </div>
}