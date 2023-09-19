'use client';

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export async function AccountsWidget({ accounts } : { accounts : any }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()!

    const createQueryString = useCallback(
        (name: string, value: string) => {
          const params = new URLSearchParams(searchParams as any)
          params.set(name, value)
          return params.toString()
        },
        [searchParams]
    )

    return <div className={`flex flex-col gap-4 flex-1 overflow-y-auto`}>
        <h2 className="font-bold">Contas</h2>
        <div className="content-list">
            {
                accounts.map( (account : any) => {
                    const status = account.status != 'blocked' && account.status != 'deactive'

                    let theme = status ? account.status == 'new' ? 'bg-lime-200' : 'bg-secondary-300' : 'bg-rose-400';

                    const href = pathname + '?' + createQueryString('id', account.id);
                    return <Link key={`account-${account.id}`} href={ href } className={ `p-2 rounded-2xl text-tiny flex ${ pathname + '?' +  searchParams === href ? 'bg-secondary-50' : '' } hover:bg-secondary-50` }>
                        <div className="flex space-x-4 items-center">
                            <div className={`rounded-full ${ theme } text-white h-8 w-8 flex items-center justify-center`}>
                                <span className="text-xs">{ account.customer.name.split(" ").map( (i : string) => i[0] ).join("").substring(0, 2)}</span>
                            </div>
                            <div className="flex-1 py-1 space-y-1">
                                <div className="flex gap-2">
                                    <div className={`uppercase text-secondary-600 font-bold`}>{account.customer?.name}</div>
                                </div>
                                <div className="flex">
                                    <div className="text-default/50">{account.accountNumber}-{account.accountKey}</div>
                                </div>
                            </div>
                        </div>
                    </Link> 
                })
            }
        </div>
    </div>
};

export function AccountsSqueleton() {
    function Item() {
        return <div className="bg-secondary-50 rounded-2xl p-4">
            <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-secondary h-8 w-8"></div>
                <div className="flex-1 space-y-1 py-1">
                    <div className="h-3 bg-secondary w-16 rounded"></div>
                    <div className="h-3 bg-secondary max-w-72 rounded"></div>
                </div>
            </div>
        </div>
    }

    return <div className="flex-1 w-full flex flex-col">
            <div className="flex flex-col gap-4 flex-1">
                <h2 className="font-bold">Contas</h2>
                <div className="content-list gap-2">
                    <Item />
                    <Item />
                    <Item />
                </div>
            </div>
        </div>
}