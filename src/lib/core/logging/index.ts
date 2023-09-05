import { WebHook } from "../pubsub";

export enum Actions {
    accountCreated = "account_created",
    passwordSetted = "password_setted",
    login = "account_login",
    transactionCreated = "transaction_created",
    transactionSigned = "transaction_signed",
    transactionCancelled = "transaction_cancelled",
    paymentCreated = "payment_created",
    paymentConfirmed = "payment_confirmed",
    paymentCancelled = "payment_cancelled"
}

const ALWAYS_IGNORE = process.env.LOGGING_ALWAYS_IGNORE === "true";

export async function Logging({ namespaceCode, action, payload, options } : { namespaceCode : string, action : Actions | string, payload : any, options? : any }){
    console.log(`[${ action }]`, (ALWAYS_IGNORE || options?.ignore) ? '(ignored)' : '', { data: payload });

    if( ALWAYS_IGNORE || options?.ignore ){
        return;
    }

    await WebHook.publish({ 
        namespaceCode,
        payload: {
            namespaceCode,
            action,
            ...payload,
            timestamp: new Date().getTime()
        }
    })
}