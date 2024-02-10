// 'use client';

import Link from "next/link";
// import { usePathname, useSearchParams } from "next/navigation";
// import { useCallback } from "react";

export function AccountWidget({ data, precision } : { data : any | null, precision : number | 0 }) {
    if( !data ){
        return;
    }

    const pathname = ""
    const clearQueryString = () => ""

    // const pathname = usePathname()
    // const searchParams = useSearchParams()!

    // const clearQueryString = useCallback(
    //     () => {
    //         try {
    //             let params = new URLSearchParams(searchParams as any)
    //             if(params.has('id')){
    //               params.delete('id')
    //             }
    //             return params.toString()
    //         } catch (error) {
                
    //         }
    //     },
    //     [searchParams]
    // )

    return <div className="absolute px-4 top-0 left-0 sm:relative max-w-xl w-full">
        <div className="w-full bg-foreground-800 p-6 rounded-3xl shadow-2xl">
            <div className="flex flex-col gap-6">
                <div className="min-h-11 flex flex-row gap-2 items-start">
                    <span className="text-2xl flex-1 font-bold">{ data.customer.name }</span>
                    <Link href={ pathname + '?' + clearQueryString() } className="rounded-xl flex items-center w-11 justify-center text-primary bg-primary" >
                        <span className="material-icon text-lg text-foreground-50">close</span>
                    </Link>
                </div>
                <table>
                    <tbody>
                        <tr>
                            <th className="py-1 px-2 font-bold text-left">Namespace</th>
                            <td className="py-1 px-2">{ data.namespaceCode }</td>
                        </tr>
                        <tr>
                            <th className="py-1 px-2 font-bold text-left">Conta</th>
                            <td className="py-1 px-2">{ data.accountNumber }-{ data.accountKey }</td>
                        </tr>
                        <tr><td colSpan={2} className="py-4"><hr /></td></tr>
                        <tr>
                            <th className="py-1 px-2 font-bold text-left">Nome</th>
                            <td className="py-1 px-2">{ data.customer.name }</td>
                        </tr>
                        <tr>
                            <th className="py-1 px-2 font-bold text-left">E-mail</th>
                            <td className="py-1 px-2">{ data.customer.email }</td>
                        </tr>
                        <tr>
                            <th className="py-1 px-2 font-bold text-left">Data de Nasc.</th>
                            <td className="py-1 px-2">{ data.customer.birthday.toISOString() }</td>
                        </tr>
                    </tbody>
                </table>

                <div className="flex flex-row gap-6">
                    <div className="flex flex-col gap-2 border flex-1 rounded-3xl p-3 sm:p-6">
                        <span className="text-xl sm:text-3xl">₼ { data.balance / ( Math.pow(10, precision) ) }</span>
                        <span>Saldo</span>
                    </div>
                    <div className="flex flex-col gap-2 border flex-1 rounded-3xl p-3 sm:p-6">
                        <span className="text-xl sm:text-3xl">₼ { data.balanceExtra / ( Math.pow(10, precision) ) }</span>
                        <span>Saldo bônus</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
};