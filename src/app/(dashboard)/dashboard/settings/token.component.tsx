'use client';

import moment from 'moment';
import { Snippet } from "@nextui-org/react";
import 'moment/locale/pt-br';

export function TokenWidget({ item } : { item : any }) {
    return <div className="p-3 rounded-2xl border-1 border-secondary-100">
        <div className="flex flex-col gap-2 text-[0.7rem]">
            <div className='flex flex-row gap-2 items-center'>
                <div className="uppercase text-secondary-600">{ (!item.expiresAt || (item?.expiresAt.getTime() > Date.now())) ? 'Ativa' : 'Vencida' }</div> 
                <div className='text-xs font-bold'>{ item.name }</div>
                <div className="text-[0.6rem] text-foreground-500">{ !item.expiresAt ? 'A chave não vence.' : <>Vence em <span className="text-secondary">{ moment( item.expiresAt ).format('D [de] MMMM [de] YYYY [às] H:mm:ss') }</span></> }</div> 
            </div>
            <div className="flex flex-1 flex-row items-center gap-2">
                <Snippet size="sm" variant="flat" color="secondary" symbol="Chave" >{ item.key }</Snippet>
                <Snippet size="sm" variant="flat" color="secondary" symbol="Segredo">{ item.secret }</Snippet>        
            </div>
        </div>
    </div>
}