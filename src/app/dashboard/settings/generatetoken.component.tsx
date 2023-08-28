'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GenerateToken({ namespaces } : { namespaces : any }){
    const router = useRouter();

    const [isActive, setActive ] = useState( false );
    const [isLoading, setLoading] = useState( false );

    async function GenerateToken( namespace : string ){
        setActive(false);
        setLoading(true);

        await fetch('/dashboard/settings/token', {
            method: 'POST',
            body: JSON.stringify( { namespace } )
        }).then( async ( result ) => {
            const data = await result.json();
            if( data.status < 300 ){
                router.refresh();
            }
        }).catch( ( err ) => {
            console.error( err )
        }).finally( ( ) => {
            setLoading(false)
        })
    }

    return <div className="relative w-11 h-11">
        <button onClick={ () => setActive( !isActive ) } className="bg-primary m-0 p-0 flex items-center justify-center w-11 h-11 rounded-xl hover:bg-primary-200">
            <span className="material-icon">{ isActive ? 'close' : isLoading ? 'refresh' : 'add' }</span>
        </button>
        {
            isActive && <div className="mt-1 absolute top-full right-0 flex flex-col bg-primary rounded-xl min-w-unit-4 p-1">
                { 
                    namespaces.map( ( ns : any ) => 
                        <button onClick={ () => GenerateToken( ns.id ) } key={ ns.id } className="px-3 py-2 rounded-xl flex items-center hover:bg-primary-50/50 whitespace-nowrap text-sm">{ ns.name }</button>
                    )
                }
            </div>
        }
    </div>
}