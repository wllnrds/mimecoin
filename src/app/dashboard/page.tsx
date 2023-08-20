import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import { User } from "@/lib/controller/user";

import { Transactions } from "./transactions";
import { Accounts, AccountsSqueleton } from "./accounts.component";
import { LimitsSqueleton } from "./limits.component";
import { Limits } from "./limits";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  if( !session ){
    redirect('./');
  }

  const user_session : any = session.user;
  const user = await User.get( user_session.id );
  if( !user ){
    redirect('./');
  }

  return (
    <div className="flex-1 w-full flex p-6 flex-col lg:flex-row gap-6 items-stretch">
      <div className="flex gap-6 flex-col">
        <Suspense fallback={ <LimitsSqueleton /> }>
          <Limits namespaceIndex={ 0 } />
        </Suspense>
        <div className="flex-1 flex gap-6 flex-col">
          <h2 className="font-bold">Contas</h2>
          <div className="content-list">
            <Suspense fallback={ <AccountsSqueleton /> }>
              <Accounts namespaceIndex={ 0 } />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 gap-6">
        <h2 className="font-bold">Transações</h2>
        <div className="content-list">
          <Suspense fallback={ <AccountsSqueleton /> }>
            <Transactions namespaceIndex={ 0 } />
          </Suspense>
        </div>
      </div>      
    </div>
  )
}
