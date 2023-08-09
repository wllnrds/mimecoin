import { Status } from "@/lib/database/db"
import { db } from "@/lib/database"
import { checkDigit } from '../core'

export class Account{
    id: number
    id_customer: number | null
    namespace_code: string | null
    account_number: string | null
    account_key: string | null
    account_password: string | null
    balance: number | null
    balance_extra: number | null
    created_at: Date | null
    updated_at: Date | null

    constructor( id: number, id_customer: number | null, namespace_code: string | null, account_number: string | null, account_key: string | null, account_password: string | null, balance: number | null, balance_extra: number | null, created_at: Date | null, updated_at: Date | null ){
        this.id = id;
        this.id_customer = id_customer;
        this.namespace_code = namespace_code;
        this.account_number = account_number;
        this.account_key = account_key;
        this.account_password = account_password;
        this.balance = balance;
        this.balance_extra = balance_extra;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static async create( id_namespace: number, name: string, document: string, birthday: Date, email: string ){
        const namespace = await db.selectFrom('namespace').select(['status','code']).where('id','=',id_namespace).executeTakeFirst();

        if(!namespace){
            throw new Error("Namespace not founded.")
        }

        if(namespace.status !== 'active'){
            throw new Error("This namespace is not able to create accounts for now.")
        }

        const preview = await db.selectFrom('customer').select('id').where( ({eb, or})=>or([
            eb('document','=',document),
            eb('email','=',email)
        ])).execute();

        if( preview.length > 0 ){
            throw new Error(`Document or email has been used by another customer.`)
        }

        const entry = await db.transaction().execute( async (trx) => {
            const customer = await trx.insertInto('customer').values({
                name,
                document,
                birthday,
                email,
                status: 'new'
            }).returningAll().executeTakeFirstOrThrow();

            const account_number = await Account.accountNumberGenerate();
            const account_key = checkDigit( account_number );

            const account = await trx.insertInto('account').values({
                id_customer: customer.id,
                namespace_code: namespace.code,
                account_number,
                account_key,
                balance : 0,
                balance_extra : 0
            }).returningAll().executeTakeFirstOrThrow();

            return {
                ...account,
                customer
            }
        })

        return entry;
    }

    static async accountNumberGenerate(){
        let last = 10000;

        await db.selectFrom('account')
        .select('id')
        .orderBy('id','asc')
        .executeTakeFirstOrThrow()
        .then((result)=>{
            last = result.id;
        }).catch(()=>{ });

        last += 1;

        if( last > 99999){
            throw new Error("This namespace reached the limit of accounts.")
        }

        return last.toString().padStart(5,'0')
    }
}

export class Customer{
    id: number
    name: string
    birthday: Date
    email: string
    document: string
    status: Status
    pin: string
    created_at: Date
    updated_at: Date

    constructor( id: number, name: string, birthday: Date, email: string, document: string, status: Status, pin: string, created_at: Date, updated_at: Date ){
        this.id = id;
        this.name = name;
        this.birthday = birthday;
        this.email = email;
        this.document = document;
        this.status = status;
        this.pin = pin;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}