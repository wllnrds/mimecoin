import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Conta criada',
}

export default function Page(){
    return <div className='bg-primary-foreground h-screen flex-1 flex flex-col items-center justify-center'>
        <div className='max-w-sm bg-white p-10 rounded-3xl flex flex-col gap-4'>   
            <div className='text-xl uppercase font-bold'>Senha configurada</div>
            <p className='text-xs leading-tight p-4 bg-slate-200 rounded-2xl'>A senha é necessária tanto para acessar as sua conta como pra confirmar transações.</p>
        </div>
    </div>
}