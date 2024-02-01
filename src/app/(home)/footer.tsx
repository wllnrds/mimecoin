import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return <div className="max-w-5xl w-full m-auto flex flex-col px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-6">
            <Link href="/">
                <h1>
                    <Image src={ '/assets/logo-white.svg' } 
                        sizes="100vw"
                        alt="Minecoin"
                        width={ 390 }
                        height={ 90 }
                        style={{
                          width: 'auto',
                          height: '2rem'
                        }} />
                </h1>
            </Link>
            <div className="flex-1"></div>
            <div className="w-[8rem] flex flex-col">
                <ul className="space-y-1">
                    <li className="text-sm font-semibold">Mimecoin</li>
                    <li><Link href="/" className={ `hover:text-primary-900 text-xs` }>Página inicial</Link></li>
                    <li><Link href="https://app.swaggerhub.com/apis/Wlln/Mimecoin/1.0.0.alpha" className={ `hover:text-primary-900 text-xs` } target="_blank">Documentação</Link></li>
                    <li><Link href="/terms" className={ `hover:text-primary-900 text-xs` }>Termos de Uso</Link></li>
                    <li><Link href="mailto:w.almeida.w@gmail.com" className={ `hover:text-primary-900 text-xs` } target="_blank">Contato</Link></li>
                </ul>
            </div>
            <div className="w-[8rem] flex flex-col">
                <ul className="space-y-1">
                    <li className="text-sm font-semibold">Plataforma</li>
                    <li><Link href="/new/user" className={ `hover:text-primary-900 text-xs` }>Cadastro</Link></li>
                    <li><Link href="/login" className={ `hover:text-primary-900 text-xs` }>Login</Link></li>
                    <li><Link href="/dashboard" className={ `hover:text-primary-900 text-xs` }>Painel do usuário</Link></li>
                    <li><Link href="/new/mime" className={ `hover:text-primary-900 text-xs` }>Criar novo Mime</Link></li>
                </ul>
            </div>
        </div>
    </div>
}