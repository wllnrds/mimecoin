import Image from "next/image";
import Link from "next/link";

import { User } from "@/lib/controller/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import { 
  AccountButton, 
  DashboardButton,
  SettingsButton
} from "@/components/button.component";

import { Namespaces } from "./namespaces.component";
import { Limit } from "../limits/limits.component";

export async function Dashboard({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if( !session ){
        return redirect('/');
    }

    const user_session : any = session.user;
    const user = await User.get( user_session.id );
    if( !user ){
        return redirect('/');
    }

    const _ns = await user.getNamespaces();
    const namespaces = [];
    for(const ns of _ns ){
        namespaces.push({
            code: ns.code,
            name : ns.name,
            pic: ns.pic,
            limit: await ns.getLimits()
        });
    }

    const limit = await user.getLimit();

    return (
        <div className="flex-1 flex flex-col foreground-900 relative min-w-[600px]">
            <div className='sticky top-0 z-50 bg-foreground-900'>
                <header className="py-2 px-3 flex flex-row items-center gap-3">
                    {/* <div className="hover:bg-foreground-700 aspect-square flex items-center justify-center h-12 w-12 rounded-full cursor-pointer">
                        <span className="material-icon text-2xl">menu</span>
                    </div> */}

                    <Link href={'/dashboard'}><h1 className="h-12 flex items-center"><Image src="/assets/logo.svg" width="150" height="30" alt={"Mimecoin"} /></h1></Link>

                    <div className="flex-1 h-12">&nbsp;</div>

                    <Namespaces user={ {  name: user.name, email: user.email } } limit={ limit } namespaces={ namespaces }></Namespaces>
                </header>
            </div>
            <div className='z-0 flex flex-1 flex-row relative'>
                <aside className=" p-6 flex flex-col gap-6 max-h-[calc(100dvh-4rem)] sticky top-[4rem] left-0">
                    <menu className="flex flex-col gap-1">
                        <DashboardButton />
                        <AccountButton />
                        <SettingsButton />
                    </menu>
                    <div className="flex-1"></div>
                    <Limit namespaces={ namespaces } />
                </aside>
                <main className="flex-1 flex md:col-span-3 2xl:col-span-7 relative">{ children }</main>
            </div>
        </div>
    );
}