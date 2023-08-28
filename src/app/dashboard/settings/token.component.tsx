'use client';

import moment from 'moment';
import { Snippet } from "@nextui-org/react";
import 'moment/locale/pt-br';

export function TokenWidget({ item } : { item : any }) {
    return <div className="p-3 rounded-2xl hover:bg-secondary-50">
        <div className="flex space-x-4 items-center">
            <div className="flex-1 gap-1 flex flex-col sm:flex-row">
                <div className="flex flex-1 flex-col items-start gap-2">
                    <div className='text-xs'>Chave assoaciada ao mime <span className="font-bold">{ item.name }</span></div>
                    <Snippet variant="solid" color="secondary" symbol="">{ item.key }</Snippet>
                    <Snippet variant="solid" color="secondary" symbol="">{ item.secret }</Snippet>                    
                </div>
                <div className="flex gap-6 items-center sm:justify-center sm:items-end">
                    <div className="text-tiny py-1">{ !item.expiresAt ? 'A chave não vence.' : <>Vence em <span className="text-secondary">{ moment( item.expiresAt ).format('D [de] MMMM [de] YYYY [às] H:mm:ss') }</span></> }</div>
                    <div className="uppercase text-secondary-600 py-1">{ (!item.expiresAt || (item?.expiresAt.getTime() > Date.now())) ? 'Ativa' : 'Vencida' }</div>
                </div>
            </div>
        </div>
    </div>
}