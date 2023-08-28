'use client';

import moment from 'moment';
import { Snippet } from "@nextui-org/react";
import 'moment/locale/pt-br';

export function TokenWidget({ item } : { item : any }) {
    return <div className="p-3 rounded-2xl hover:bg-secondary-50">
        <div className="flex flex-col gap-2">
            <div className="gap-1 flex flex-col items-center sm:flex-row">
                <div className="flex flex-1 flex-row items-center gap-2">
                    <Snippet variant="bordered" color="secondary" symbol="Chave">{ item.key }</Snippet>
                    <Snippet variant="bordered" color="secondary" symbol="Segredo">{ item.secret }</Snippet>        
                </div>
                <div className="flex gap-6 items-center px-2">
                    <div className="uppercase text-secondary-600 py-1">{ (!item.expiresAt || (item?.expiresAt.getTime() > Date.now())) ? 'Ativa' : 'Vencida' }</div>
                </div>
            </div>
            <div className='flex flex-col gap-1'>
                <div className='text-xs'>Chave assoaciada ao mime <span className="font-bold">{ item.name }</span></div>  
                <div className="text-tiny">{ !item.expiresAt ? 'A chave não vence.' : <>Vence em <span className="text-secondary">{ moment( item.expiresAt ).format('D [de] MMMM [de] YYYY [às] H:mm:ss') }</span></> }</div> 
            </div>
        </div>
    </div>
}