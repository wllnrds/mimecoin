'use client';

import { useSearchParams } from "next/navigation";

export async function NamespacesWidget({ namespaces = [] , limit } : { namespaces : Array<any>, limit : any  }){
    const searchParams = useSearchParams();
    const namespaceIndex = searchParams.has('namespaceIndex') ? parseInt( searchParams.get('namespaceIndex') || '0' ) : 0 ;

    const square_base = "border box-content border-primary text-primary rounded-xl aspect-square overflow-hidden justify-center items-center flex";
    const square_active = "border box-content bg-secondary text-secondary-foreground rounded-xl aspect-square overflow-hidden justify-center items-center flex";

    const square_inner = "text-xs aspect-square overflow-hidden justify-center items-center flex w-8 line-clamp-1";

    return (<div className="flex flex-col gap-3">
        <aside className="flex gap-3 justify-start align-middle items-center bg-white rounded-2xl p-4 flex-wrap">
            <span className="flex-1 text-xs">Seus Mimes</span>
            <div className="flex flex-wrap gap-2">
            { 
                ( namespaces.length == 0 ) ? 
                    <div className={ `${ square_base } border-dashed` }>
                        <span className={ square_inner }></span>
                    </div> : namespaces.map( ( namespace, index ) => 
                    <a href="/" key={`namespaces-link-${ namespace.id }`} className={ `${ index === namespaceIndex ? square_active : square_base } hover:bg-primary-50` } title={ namespace.name }>
                        { namespace.pic ? <img src={ namespace.pic } /> : <span className={ square_inner }>{ namespace.code }</span>}
                    </a> )
            }
            </div>
        </aside>        
        
        {
            ( limit.current > 0 ) && <a className="flex gap-3 justify-start align-middle items-center bg-primary text-primary-foreground rounded-2xl p-2 pl-5 hover:bg-primary-200" title="Novo Mime">
                <span className="material-icon text-primary-foreground text-lg aspect-square flex justify-center items-center">add_circle</span><span className="text-xs">Criar Novo Mime</span>
                </a>
        }   
    </div>
    )
  };
  