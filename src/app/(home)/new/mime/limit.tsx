import { authOptions } from "@/lib/auth";
import { User } from "@/lib/controller/user";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import CreateMime from "./create";

export default async function LimitWare(){
    const session = await getServerSession(authOptions);

    if (!session) {
        return redirect('/');
    }
    
    const user_session : any = session?.user;
    const user = await User.get(user_session.id);
    const limits = await user.getLimit();

    if( limits.current <= 0 ){
        return <div className="flex h-full flex-1 flex-row bg-foreground p-4 items-center justify-center">
            <div className="flex flex-col gap-2 bg-white p-8 rounded-[2rem] w-full max-w-2xl">
                <h1 className="text-3xl">Limite atingido</h1>
                <p>Você ja atingiu seu limite de Mimes criados.</p>
                <hr className="my-4"/>
                <Link href="/dashboard" className="text-secondary">Ir para dashboard</Link>
            </div>
        </div>
    }else{
        return <CreateMime />;
    }
}