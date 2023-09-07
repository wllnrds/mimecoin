'use client';

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function Namespaces({
    user,
    namespaces,
    limit
}: { 
    user : { name: string, email: string },
    namespaces: Array< { code : string, pic : string, name : string, limit: { precision: number, max: number, used: number, current: number } } >,
    limit?: { max: number, used: number, current: number }
}) {
    const [showMenu, setShowMenu] = useState( false );
    const [showList, setShowList] = useState( true );

    function reduceList(){
        setShowList( !showList );
    }

    function menu(){
        setShowMenu( !showMenu );
    }

    const router = useRouter()
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

    useEffect(()=>{
        if( showMenu ) setShowMenu( false )
    },[router,pathname,searchParams])

    const namespaceIndex = searchParams.has('namespaceIndex') ? parseInt( searchParams.get('namespaceIndex') || '0' ) : 0 ;

    return (
        <div>
            <button onClick={ menu } className="aspect-square flex items-center justify-center h-10 w-10 rounded-full border-2 cursor-pointer">
                <span className="text-sm">{ namespaces[ namespaceIndex ].code }</span>
            </button>
            <div className={`absolute flex w-96 max-w-screen max-h-[calc(100vh-3.5rem)] right-0 top-[3.5rem] box-border pt-1 px-4 pb-4 ${ showMenu ? 'visible' : 'hidden' }`}>
                <div className="overflow-clip bg-primary-100 p-3 rounded-[1.25rem] border-1 border-primary-200 w-full shadow-xl flex flex-col gap-4">
                    <div className="flex items-center flex-col p-3">
                        <span className="text-xs font-semibold">{ user.email }</span>
                        <div className="mt-6 mb-2 h-16 w-16 flex items-center justify-center bg-white rounded-full"></div>
                        <span>Oi { user.name.split(' ').shift() } 😊</span>
                    </div>
                    <div className="rounded-[1.25rem] flex flex-col gap-[2px] overflow-clip w-full">
                        <button onClick={ reduceList } className={ "w-full flex flex-row items-center gap-3 bg-primary-50 px-5 py-3 rounded-md hover:bg-primary-200" }>
                            <span className="text-xs flex-1 text-left font-semibold">
                                { showList ? 'Ocultar sistemas' : 'Mostrar sistemas' }
                            </span>
                            <div className={ `flex flex-row transition-opacity ${ !showList ? 'opacity-100' : 'opacity-0' }` }>
                                { namespaces.slice(0,2).map( ns => <div className="w-4" key={ `ns-circle-${ ns.code }` }><div className="aspect-square flex items-center justify-center h-8 w-8 rounded-full bg-teal-200 shadow-small"><span className="text-xs">{ ns.code }</span></div></div>) }
                                { namespaces.length > 2 ? <div className="w-4"><div className="aspect-square flex items-center justify-center h-8 w-8 rounded-full bg-teal-200 shadow-small"><span className="text-xs">+{ namespaces.length - 2 }</span></div></div> : <></> }
                            </div>
                            <div className="aspect-square flex items-center justify-center h-8 w-8 rounded-full ">
                                <span className={ `material-icon transition-transform text-lg ${ showList ? 'rotate-180' : '' }` }>expand_more</span>
                            </div>
                        </button>
                        <div className={`flex flex-col gap-[2px] overflow-clip ${ showList ? 'h-auto' : 'h-0' }`}>
                            { namespaces.map( ( ns, index ) =>
                                <Link key={ `ns-link-${ ns.code }` } href={ pathname + '?' + createQueryString('namespaceIndex', index.toString() ) }>
                                    <div className="w-full flex flex-row items-center gap-3 bg-primary-50 px-5 py-3 rounded-md hover:bg-primary-200">
                                        <div className="aspect-square flex items-center justify-center h-8 w-8 rounded-full bg-teal-200">
                                            <span className="text-xs">{ ns.code }</span>
                                        </div>
                                        <div className="text-sm flex flex-col">
                                            <span className="font-semibold">{ ns.name }</span>
                                            <span className="font-light text-xs">{ (( ns.limit.used/ns.limit.max ) * 100).toFixed(0) }% de { ( ns.limit.max / Math.pow(10, ns.limit.precision) ).toLocaleString('pt-BR',{
                                                notation: 'compact',
                                                maximumFractionDigits: 1
                                            }) } usado</span>
                                        </div>
                                    </div>
                                </Link>
                            ) }
                            { 
                                limit && limit?.current > 0 ? <div className="w-full flex flex-row items-center gap-3 bg-primary-50 px-5 py-3 rounded-md hover:bg-primary-200">
                                    <div className="aspect-square flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary">
                                        <span className="material-icon text-lg">add</span>
                                    </div>
                                    <div className="text-sm flex flex-col">Criar novo sistema
                                    </div>
                                </div> : <></>
                            }
                            <button onClick={() => signOut()} className={ "w-full flex flex-row items-center gap-3 bg-primary-50 px-5 py-3 rounded-md hover:bg-primary-200" }>
                                <div className="aspect-square flex items-center justify-center h-8 w-8 rounded-full ">
                                    <span className="material-icon">logout</span>
                                </div>
                                <span className="text-xs">Logout</span>
                            </button>
                        </div>
                    </div>                    
                </div>
            </div>
        </div>
    );
}