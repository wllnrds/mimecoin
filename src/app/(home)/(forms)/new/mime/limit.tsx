import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { User } from "@/lib/controller/user";
import Link from "next/link";
import { redirect } from "next/navigation";
import CreateMime from "./create";

export default async function LimitWare(){
    const session = await getServerSession(authOptions);

    if (!session) {
        return redirect('/new/user');
    }
    
    const user_session : any = session?.user;
    const user = await User.get(user_session.id);
    const limits = await user.getLimit();

    if( limits.current <= 0 ){        
        return (<div className="flex flex-row items-center p-8 justify-center">
            <div className="flex flex-col gap-2 p-8 rounded-[2rem] w-full max-w-5xl">
                <h1 className="text-3xl">Limite atingido</h1>
                <p>Você ja atingiu seu limite de Mimes criados.</p>
                <hr className="my-4"/>
                <Link href="/dashboard" className="text-secondary">Ir para dashboard</Link>
            </div>
        </div>)
    }else{
        return <CreateMime />;
    }
}