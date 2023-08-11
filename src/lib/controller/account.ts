import { Status } from "@/lib/database/db"
import { db } from "@/lib/database"
import { checkDigit } from '../core'

export class Account{
    id: number
    id_customer: number | null
    namespace_code: string | null
    accountNumber: string | null
    accountKey: string | null
    accountPassword: string | null
    balance: number | null
    balanceExtra: number | null
    createdAt: Date | null
    updatedAt: Date | null

    constructor( id: number, id_customer: number | null, namespace_code: string | null, accountNumber: string | null, accountKey: string | null, accountPassword: string | null, balance: number | null, balanceExtra: number | null, createdAt: Date | null, updatedAt: Date | null ){
        this.id = id;
        this.id_customer = id_customer;
        this.namespace_code = namespace_code;
        this.accountNumber = accountNumber;
        this.accountKey = accountKey;
        this.accountPassword = accountPassword;
        this.balance = balance;
        this.balanceExtra = balanceExtra;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static async create( idNamespace: string, name: string, document: string, birthday: Date, email: string ){
        const namespace = await db.selectFrom('Namespace').select(['status','code']).where('id','=',idNamespace).executeTakeFirst();

        if(!namespace){
            throw new Error("Namespace not founded.")
        }

        if(namespace.status !== 'active'){
            throw new Error("This namespace is not able to create accounts for now.")
        }

        const preview = await db.selectFrom('Customer').select('id').where( ({eb, or})=>or([
            eb('document','=',document),
            eb('email','=',email)
        ])).execute();

        if( preview.length > 0 ){
            throw new Error(`Document or email has been used by another customer.`)
        }

        const entry = await db.transaction().execute( async (trx) => {
            const customer = await trx.insertInto('Customer').values({
                name,
                document,
                birthday,
                email,
                status: 'new'
            }).returningAll().executeTakeFirstOrThrow();

            const accountNumber = await Account.accountNumberGenerate();
            const accountKey = checkDigit( accountNumber );

            const account = await trx.insertInto('NamespaceAccount').values({
                idCustomer: customer.id,
                namespaceCode: namespace.code,
                accountNumber,
                accountKey,
                balance : 0,
                balanceExtra : 0
            }).returningAll().executeTakeFirstOrThrow();

            return {
                ...account,
                customer
            }
        })

        Mailer.Send('createAccountPassword', entry );

        return entry;
    }

    static async accountNumberGenerate(){
        let last = 10000;

        await db.selectFrom('NamespaceAccount')
        .select('accountNumber')
        .orderBy('accountNumber','asc')
        .executeTakeFirstOrThrow()
        .then((result)=>{
            last = parseInt(result.accountNumber);
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
    createdAt: Date
    updatedAt: Date

    constructor( id: number, name: string, birthday: Date, email: string, document: string, status: Status, pin: string, createdAt: Date, updatedAt: Date ){
        this.id = id;
        this.name = name;
        this.birthday = birthday;
        this.email = email;
        this.document = document;
        this.status = status;
        this.pin = pin;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}