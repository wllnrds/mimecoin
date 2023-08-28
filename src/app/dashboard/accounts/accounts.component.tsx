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

    return <div className="flex flex-col gap-4 flex-1">
        <h1>Contas</h1>
        <div className="flex flex-col gap-2">
            {
                accounts.map( (account : any) => {
                    const status = account.status != 'blocked' && account.status != 'deactive'
                    return <Link key={`account-${account.id}`} href={ pathname + '?' + createQueryString('id', account.id) }>
                        <div className={`p-4 bg-white text-tiny rounded-2xl hover:bg-primary-50`}>
                            <div className="flex space-x-4 items-center">
                                <div className={`rounded-full text-white h-8 w-8 flex items-center justify-center ${status ? ' bg-success' : ' bg-danger'}`}>{ account.customer.name.split(" ").map( (i : string) => i[0] ).join("").substring(0, 2)}</div>
                                <div className="flex-1 py-1">
                                    <div className="font-bold">{account.customer?.name}</div>
                                    <div>{account.accountNumber}-{account.accountKey}</div>
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

    return <div className="flex-1 w-full flex p-6 flex-col gap-6 overflow-auto">
            <div className="flex flex-col gap-4 flex-1">
                <h1>Contas</h1>
                <div className="flex flex-col gap-2">
                    <Item />
                    <Item />
                    <Item />
                </div>
            </div>
        </div>
}