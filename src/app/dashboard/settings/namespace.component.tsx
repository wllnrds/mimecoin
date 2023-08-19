import { Namespace } from '@/lib/controller/namespace';
import moment from 'moment';
import 'moment/locale/pt-br';

export async function NamespaceWidget({ item } : { item : Namespace }) {
    return <div className="p-3 rounded-2xl hover:bg-secondary-50">
        <div className="flex space-x-4 items-center">
            <div className="flex-1 gap-1 flex flex-col sm:flex-row">
                <div className="flex flex-1 gap-2 items-center">
                    <span className="font-mono bg-secondary text-secondary-foreground py-1 px-3 rounded-3xl">{ item.code }</span>
                    <span className="font-bold gap-3 flex-1">{ item.name }</span>
                </div>
                <div className="flex gap-6 sm:justify-center items-center">
                    <div className="text-tiny py-1">Criando em <span className="text-secondary">{ moment( item.createdAt ).format('D [de] MMMM [de] YYYY [às] H:mm:ss') }</span></div>
                    <div className="uppercase text-secondary-600 py-1"></div>
                </div>
            </div>
        </div>
    </div>
}