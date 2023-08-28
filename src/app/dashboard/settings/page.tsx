import { User } from "@/lib/controller/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Suspense } from "react";
import { LimitsSqueleton, LimitsWidget } from "./limit.component";
import { TokenWidget } from "./token.component";
import { NamespaceWidget } from "./namespace.component";
import { Metadata } from "next";
import { GenerateToken } from "./generatetoken.component";

export const metadata: Metadata = {
    title: 'Settings',
}

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return;
    }

    const user_session: any = session.user;
    const user = await User.get(user_session.id);
    if (!user) {
        return;
    }

    if (user.password) delete user.password

    async function Limits() {
        const user_limit = await user.getLimit();
        return <LimitsWidget total={user_limit.max} used={user_limit.used} />
    }

    let tokens = await user.getTokens();
    let namespaces = await user.getNamespaces();

    return <div className="w-full flex-1 p-6 flex flex-col gap-6 max-w-screen justify-start">
        <div className="flex gap-6 flex-col lg:flex-row">
            <div className="content-card">
                <h2 className="text-2xl">Sua conta</h2>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-6">
                        <div className="font-bold">Nome</div>
                        <div className="col-span-4">{user.name}</div>
                    </div>
                    <div className="flex gap-6">
                        <div className="font-bold">E-mail</div>
                        <div className="col-span-4">{user.email}</div>
                    </div>
                </div>
            </div>
            <Suspense fallback={<LimitsSqueleton />}>
                <Limits />
            </Suspense>
        </div>
        <div className="content-card">
            <h2 className="text-2xl">Seus mimes</h2>
            <div>
                { namespaces.map( item => <NamespaceWidget key={ `namespaces-${ item.id }` } item={ item } /> ) }
            </div>
        </div>
        <div className="content-card">
            <div className="flex flex-row">
                <h2 className="flex-1 text-2xl">Suas chaves</h2>
                <GenerateToken namespaces={ namespaces } />
            </div>
            <div>
                { tokens.map(item => <TokenWidget key={`accesstoken-${item.id}`} item={item} />) }
            </div>
            <div className="flex flex-col gap-4 p-2">
                <p className="font-bold">Como usar:</p>
                <p>Adicione no header das requisições um JWT com o token de API do namespace e o JWT do usuário logado assinados com o segredo da chave utilizada. Você pode incluir informações de prazo de validade do token gerado para aumentar a segurança, mas a informação X-Integration-Token é obrigatória em todas as requisições.</p>
                <pre className="p-6 bg-primary-50 rounded-3xl font-mono text-sm">
                    {`header = {
    "alg": "HS256",
    "typ": "JWT"
}

payload = {
    "X-Integration-Token":"Sua chave de API",
    "X-Resource-Token":"JWT do usuário autenticado" 
}

HMACSHA256(
    base64UrlEncode( header ) + '.' +
    base64UrlEncode( payload ),
    (secret da chave anunciada no payload)
)`}
                </pre>
            </div>
        </div>
    </div>;
}