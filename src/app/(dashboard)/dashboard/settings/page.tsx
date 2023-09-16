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
    title: 'Configurações',
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
            <Suspense fallback={<LimitsSqueleton />}><Limits /></Suspense>
        </div>
        <div className="content-card">
            <h2 className="text-default text-lg">Seus mimes</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
                { namespaces.map( item => <NamespaceWidget key={ `namespaces-${ item.id }` } item={ item } /> ) }
            </div>
        </div>
        <div className="content-card">
            <div className="flex flex-row items-center">
                <h2 className="text-default text-lg flex-1">Suas chaves</h2>
                { namespaces.length > 0 && <GenerateToken namespaces={ namespaces.flatMap( ns => ({ id: ns.id, code: ns.code, pic: ns.pic, name: ns.name , status: ns.status, createdAt: ns.createdAt, updatedAt: ns.updatedAt, createdBy: ns.createdBy, }) )  } />}
            </div>
            <div className="flex flex-col gap-2">
                { tokens.map(item => <TokenWidget key={`accesstoken-${item.id}`} item={item} />) }
            </div>
            <hr className="my-4" />
            <div className="flex flex-col gap-3">
                <p className="font-bold">Como usar:</p>
                <p>Adicione no header das requisições um JWT com o token de API do namespace e o JWT do usuário logado assinados com o segredo da chave utilizada. Você pode incluir informações de prazo de validade do token gerado para aumentar a segurança, mas a informação X-Integration-Token é obrigatória em todas as requisições.</p>
                <pre className="p-6 bg-foreground-200 text-white rounded-[1rem] font-mono text-xs">
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