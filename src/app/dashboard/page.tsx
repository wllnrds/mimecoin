import { Suspense } from "react";
import { Accounts, AccountsSqueleton } from "./accounts.component";
import { Transactions } from "./transactions";

export default function Home() {
  return (
    <div className="flex-1 w-full flex p-6 flex-col lg:flex-row gap-6 md:overflow-auto">
      <div className="flex gap-6 flex-col">
        {/* <Suspense fallback={ <LimitsSqueleton /> }>
          <Limits namespaceIndex={ 0 } />
        </Suspense> */}
        <div className="flex-1 flex gap-6 flex-col">
          <h2 className="font-bold">Contas</h2>
          <Suspense fallback={ <AccountsSqueleton /> }>
            <Accounts namespaceIndex={ 0 } />
          </Suspense>
        </div>
      </div>
      <div className="flex flex-col flex-1 gap-6">
        <h2 className="font-bold">Transações</h2>
        <div className="flex-1 bg-white rounded-2xl lg:overflow-x-auto p-2">
          <Suspense fallback={ <AccountsSqueleton /> }>
            <Transactions namespaceIndex={ 0 } />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
