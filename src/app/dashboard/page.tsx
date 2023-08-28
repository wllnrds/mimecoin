import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import { User } from "@/lib/controller/user";

import { Transactions } from "./transactions";
import { AccountsSqueleton } from "./accounts/accounts.component";
import { LimitsSqueleton } from "./limits.component";
import { Limits } from "./limits";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function Home({ searchParams } : {  searchParams : { [key: string]: string | string[] | undefined } }) {
  const session = await getServerSession(authOptions);

  if( !session ){
    redirect('./');
  }

  const user_session : any = session.user;
  const user = await User.get( user_session.id );
  if( !user ){
    redirect('./');
  }

  const namespaceIndex = searchParams.namespaceIndex ? parseInt( searchParams.namespaceIndex as string ) : 0 ;

  return (
    <div className="flex-1 w-full flex p-6 flex-col lg:flex-row gap-6 items-stretch">
      <div className="flex gap-6 flex-col">
        <Suspense fallback={ <LimitsSqueleton /> }>
          <Limits namespaceIndex={ namespaceIndex } />
        </Suspense>
      </div>
      <div className="flex flex-col flex-1 gap-6">
        <h2 className="font-bold">Transações</h2>
        <div className="content-list">
          <Suspense fallback={ <AccountsSqueleton /> }>
            <Transactions namespaceIndex={ namespaceIndex } />
          </Suspense>
        </div>
      </div>      
    </div>
  )
}
