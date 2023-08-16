import { suid } from 'rand-token';
import bcrypt from 'bcrypt';

import { Status } from "@/lib/database/db";
import { db } from "@/lib/database";
import { Account } from './account';
import { Transaction } from './transation';
import { validateDigit } from '../core';

export class Namespace{
    id: string
    code: string
    pic: string
    name: string 
    status: Status
    createdAt: Date
    updatedAt: Date
    createdBy: string

    constructor( id: string, code: string, pic: string, name: string, status: Status, createdAt: Date, updatedAt: Date, createdBy: string ){
        this.id = id;
        this.code = code;
        this.pic = pic;
        this.name = name;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.createdBy = createdBy;
    }

    static async create( code : string, pic : string | '', name: string, precision: number | 2, idUser : string ){
        const entry = await db.transaction().execute( async (trx) => {
            const newEntry = await trx.insertInto('Namespace').values({
                code: code,
                name: name,
                pic: pic || '',
                status: "active",
                createdBy: idUser
            }).returningAll().executeTakeFirstOrThrow();

            const limit = await trx.insertInto('NamespaceLimit').values({
                active: true,
                expiresAt: null,
                idNamespace: newEntry.id,
                precision: precision,
                maxOffer: 100000 * Math.pow(10, precision)
            }).returningAll().executeTakeFirstOrThrow();

            await trx.insertInto('UserNamespace').values({
                idNamespace: newEntry.id,
                idUser: idUser,
            }).executeTakeFirstOrThrow();

            return {
                ...newEntry,
                ...limit
            };
        });

        return Namespace.DbToObj(entry);
    }

    static async get( id:string ){
        const entry = await db.selectFrom('Namespace').selectAll().where('id','=',id).executeTakeFirst();

        if(!entry){
            throw new Error("Entry not founded.");
        }

        return Namespace.DbToObj(entry);
    }

    async getLimits(){
        const limits = await db.selectFrom('NamespaceLimit').selectAll().where(({ eb , and, or })=>and([
            eb('idNamespace','=',this.id),
            eb('active','=',true),
            or([
                eb('expiresAt','>',new Date()),
                eb('expiresAt','is', null),
            ]),
        ])).execute();

        const max_offer = limits.reduce(( final, crr ) => final + ( crr.maxOffer || 0 ), 0 );
        const precision = limits.reduce(( final, crr ) => final > crr.precision ? final : crr.precision , 0 )

        const balances = await db.selectFrom('NamespaceAccount').select(['balance','balanceExtra']).where('namespaceCode','=',this.code).execute();
        const current_offer = balances.reduce( (prv,crr) => prv + ( crr.balance || 0 ) + ( crr.balanceExtra || 0 ) , 0 );

        return {
            precision,
            max: max_offer,
            used: current_offer,
            current: max_offer - current_offer
        };
    }

    async createAcessToken( idUser : string, expiresAt : Date | null ){
        let token : { key : string, secret : string } = { 
            key: `mimecoin_${ suid(8) }`,
            secret: suid(16)
        };

        const secret = bcrypt.hashSync( token.secret, bcrypt.genSaltSync( 10 ) )
        
        await db.insertInto('AccessToken').values({
            idUser: idUser,
            idNamespace: this.id,
            key: token.key,
            secret: secret,
            expiresAt: expiresAt?.toISOString()
        }).executeTakeFirstOrThrow()

        return token;
    }

    async createAccount( name: string, email: string, document:string, birthday:string){
        const entry = await Account.create(
            this.id,
            name,
            document,
            new Date( birthday ),
            email
        );
        return entry;
    }

    static DbToObj( data: any ){
        return new Namespace(
            data.id,
            data.code,
            data.pic,
            data.name,
            data.status,
            data.createdAt,
            data.updatedAt,
            data.createdBy
        )
    }

    static async CheckToken( key: string, secret: string ){
        const token = await db.selectFrom('AccessToken').selectAll().where('AccessToken.key', '=', key ).executeTakeFirst();

        if( !token ){
            throw new Error('Token invalid.')
        }

        const result = bcrypt.compareSync( secret, token.secret || '' )

        if( !result ){
            throw new Error('Secret invalid.')
        }

        if( token.expiresAt != null && new Date( token.expiresAt ) < new Date() ){
            throw new Error(`Token expired on ${ new Date( token.expiresAt ).toLocaleString() }`)
        }

        return await Namespace.get( token.idNamespace ) ;
    }

    async getAccount( number : string ){
        const accountNumber = validateDigit( number );

        if( !accountNumber ){
            throw new Error("Invalid account number");
        }
    
        const account_db = await db.selectFrom('NamespaceAccount').selectAll().where(({eb,and})=>and([
            eb('accountNumber','=',accountNumber),
            eb('namespaceCode','=',this.code)
        ])).executeTakeFirst()

        
        if( !account_db ){
            throw new Error("Account not founded");
        }

        const account = Account.DbToObj( account_db );
        await account.loadCustomer();

        return account;
    }

    async deposit( account : string, amount : number, 
        type : 'deposit' | 'refund' | 'bonus' | 'cashback' = 'deposit',
        headline : string = '', 
        details : string = ''){

        const { current, precision } = await this.getLimits();

        const fixedAmount = amount * ( Math.pow(10, precision) )

        if( current < fixedAmount ){
            throw new Error("This namespace reached mint limit.");
        }

        const accountNumber = validateDigit( account );

        if( !accountNumber ){
            throw new Error("Invalid account number");
        }

        const account_ref = await db
            .selectFrom('NamespaceAccount')
            .selectAll()
            .where(({and, eb})=>and([
                eb('namespaceCode','=',this.code),
                eb('accountNumber','=', accountNumber)
            ])).executeTakeFirst();

        if( !account_ref ){
            throw new Error("Invalid account to deposit");
        }
        
        const transaction = await Transaction.preBuilt( type, fixedAmount, headline, details, this.code, null, accountNumber );
        try {
            await transaction.Sign();
        } catch (error) {
            throw error
        }

        return transaction;
    }

    async getBalance( account : Account ){
        let { balance, balanceExtra } = account;
        const { precision } = await this.getLimits();

        if( balance == null ){
            balance = 0;
        }

        if( balanceExtra == null ){
            balanceExtra = 0;
        }

        return {
            balance: (balance / ( Math.pow(10, precision) )).toFixed( precision ).toString(),
            balanceExtra: (balanceExtra / ( Math.pow(10, precision) )).toFixed( precision ).toString()
        }
    }

    async getTransactions( account : Account, start : Date, end : Date ){
        const { precision } = await this.getLimits();
        const transactions : Array<any> = await db.selectFrom('Transaction').selectAll().where(({and,eb}) => {
            const q = [
                eb('Transaction.namespaceCode','=',this.code),
                eb('Transaction.namespaceAccount','=',account.accountNumber)
            ];

            if( start ){
                if( !end ){
                    end = new Date( start.setDate( start.getDate() + 30 ).toLocaleString() );
                }

                q.push( eb('Transaction.confirmedAt','>', start ) )
                q.push( eb('Transaction.confirmedAt','<', end ) )
            }

            return and(q)
        }).orderBy('Transaction.confirmedAt', 'desc').execute();

        for( const t of transactions ){
            t.amount = (t.amount / ( Math.pow(10, precision) )).toFixed( precision ).toString();
        }

        return transactions;
    }
}