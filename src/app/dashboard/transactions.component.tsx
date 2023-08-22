import { Transaction } from "@/lib/controller/transation";
import moment from 'moment';
import 'moment/locale/pt-br';

export function TransactionsWidget({ transactions = [] } : { transactions : Array<Transaction> }){
    const types = {
        "bonus": "Bônus",
        "cashback": "Cashback",
        "deposit": "Depósito",
        "mint": "Cunhado",
        "payment": "Pagamento",
        "refund": "Reembolso",
        "transfer": "Transferência",
        "withdraw" : "Saque"
    }

    const statusTheme = {
        'cancelled': 'danger',
        'pending': 'warning',
        'confirmed': 'success'
    }
    
    const types_icons = {
        "bonus": "redeem",
        "cashback": "redeem",
        "deposit": "money",
        "mint": "money",
        "payment": "payments",
        "refund": "undo",
        "transfer": "currency_exchange",
        "withdraw" : "attach_money"
    }

    return transactions.map( tra => {
        if( tra == undefined ){
            return;
        }else{
            return <div className={ "p-2 rounded-2xl hover:bg-" + statusTheme[ tra.status ].toString() + "/10 text-tiny" } key={`transaction-${ tra.id }`}>
                <div className="flex space-x-4 items-center">
                    <div className={`rounded-full bg-${ statusTheme[ tra.status ] } text-white h-8 w-8 flex items-center justify-center`}>
                        <span className="material-icon text-2xl">{ types_icons[tra.type] }</span>
                    </div>
                    <div className="flex-1 py-1 space-y-1">
                        <div className="flex gap-2">
                            <div className={`uppercase text-${ statusTheme[ tra.status ] }-600 font-bold`}>{ types[tra.type] }</div>
                            <div className="text-default/50">{ tra.confirmedAt ? 'confirmado ' : 'realizada ' } { moment( tra.confirmedAt || tra.createdAt ).fromNow() }</div>
                        </div>
                        <div className="flex">
                            <div className="flex-1 flex gap-2">
                                <span className={ `font-bold ${ tra.status == 'cancelled' ? 'line-through' : '' }` }>{ tra.headline }</span>
                            </div>
                            <div className={ tra.amount < 0 ? "text-danger" : "text-success-50" }>₼ { tra.amount }</div>
                        </div>
                        <div>{ tra.details }<span className="hover:bg-danger/10 hover:bg-success/10 hover:bg-warning/10 text-danger-600 text-success-600 text-warning-600"></span></div>
                    </div>
                </div>
            </div>
        }
    })
  };
  