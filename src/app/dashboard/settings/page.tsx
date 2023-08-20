import { User } from "@/lib/controller/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Suspense } from "react";
import { LimitsSqueleton, LimitsWidget } from "./limit.component";
import { TokenWidget } from "./token.component";
import { NamespaceWidget } from "./namespace.component";
import { Metadata } from "next";

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
            <h2 className="text-2xl">Suas chaves</h2>
            <div>
                { tokens.map(item => <TokenWidget key={`accesstoken-${item.id}`} item={item} />) }
            </div>
        </div>
    </div>;
}