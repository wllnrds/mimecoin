import bcrypt from 'bcrypt'
import { db } from "../database"
import { TransactionStatus, TransactionType } from "../database/db"

export class Transaction{
    id: string
    type: TransactionType
    amount: number
    headline: string
    details: string
    namespaceCode: string
    namespaceAccount: string | null
    namespaceAccountOrigin: string | null
    namespaceAccountTarget: string | null
    createdAt: Date
    status: TransactionStatus

    hash: string | null
    confirmedAt: Date | null

    private constructor(
        id: string,
        type: TransactionType,
        amount: number,
        headline: string,
        details : string,
        namespaceCode: string,
        namespaceAccount: string | null,
        namespaceAccountOrigin: string | null,
        namespaceAccountTarget: string | null,
        createdAt: Date,
        status: TransactionStatus,
        hash: string | null,
        confirmedAt: Date | null,
    ){
        this.id = id,
        this.type = type
        this.amount = amount
        this.headline = headline
        this.details = details
        this.namespaceCode = namespaceCode
        this.namespaceAccount = namespaceAccount
        this.namespaceAccountOrigin = namespaceAccountOrigin
        this.namespaceAccountTarget = namespaceAccountTarget
        this.createdAt = createdAt
        this.status = status
        this.hash = hash
        this.confirmedAt = confirmedAt
    }

    private static DbToObj( data: any ){
        return new Transaction(
            data.id,
            data.type,
            data.amount,
            data.headline,
            data.details,
            data.namespaceCode,
            data.namespaceAccount,
            data.namespaceAccountOrigin,
            data.namespaceAccountTarget,
            data.createdAt,
            data.status,
            data.hash,
            data.confirmedAt
        )
    }

    static async preBuilt(
        type: TransactionType,
        amount: number,
        headline: string,
        details : string,
        namespaceCode: string,
        namespaceAccountOrigin: string | null,
        namespaceAccountTarget: string | null
    ){
        if( !namespaceAccountOrigin && !namespaceAccountTarget){
            throw new Error("Transactions needs a origin or a target");
        }

        const record = await db.insertInto('Transaction').values({
            type,
            amount: namespaceAccountOrigin ? Math.abs( amount ) * -1 : Math.abs( amount ),
            headline,
            details,
            namespaceCode,
            namespaceAccount: namespaceAccountOrigin,
            namespaceAccountOrigin,
            namespaceAccountTarget,
            createdAt: new Date(),
            status: "pending"
        }).returningAll().executeTakeFirstOrThrow();

        return Transaction.DbToObj(record);
    }

    static async getById( code:string, id : string ){
        const transaction = await db.selectFrom('Transaction').selectAll()
            .where(({and,eb}) => and([
                eb('id','=',id),
                eb('namespaceCode','=',code)
            ])).executeTakeFirst();

        if( !transaction ){
            throw new Error("Transaction not founded");
        }

        return Transaction.DbToObj( transaction );
    }

    isSigned(){
        if( this.hash ){
            return this.confirmedAt;
        }else{
            return false;
        }
    }

    async Sign( originPassword? : string ){
        if( this.status != 'pending' ){        
            if( this.status == 'cancelled'){
                throw new Error("Transaction was cancelled")
            }

            if( this.isSigned() ){
                throw new Error("Already signed");
            }
        }

        if( !this.namespaceAccountOrigin && !this.namespaceAccountTarget ){
            throw new Error("Transaction needs a source or target");
        }

        let accountSource = this.namespaceAccountOrigin ? await db.selectFrom('NamespaceAccount').selectAll().where(
            ({and,eb})=>and([
                eb('accountNumber' , '=' , this.namespaceAccountOrigin),
                eb('namespaceCode', '=', this.namespaceCode)
            ])
        ).executeTakeFirst() : null ;

        if( this.namespaceAccountOrigin ){
            if( !accountSource ){
                throw new Error("Fail to find origin account");
            }

            if( accountSource.balance < Math.abs( this.amount ) ){
                throw new Error("Insufficient funds");
            }

            if( !accountSource.accountPassword || accountSource.accountPassword === ''){
                throw new Error("Account needs a password to confirm transations")
            }

            if( !originPassword || originPassword === '' ){
                throw new Error("Origin password is invalid");
            }

            const result = bcrypt.compareSync( originPassword, accountSource.accountPassword);

            if(!result){
                throw new Error("Origin password is invalid");
            }
        }

        let accountTarget = await db.selectFrom('NamespaceAccount').selectAll().where(
            ({and,eb})=>and([
                eb('accountNumber' , '=' , this.namespaceAccountTarget),
                eb('namespaceCode', '=', this.namespaceCode)
            ])
        ).executeTakeFirst();

        if( this.namespaceAccountTarget ){
            if( !accountTarget ){
                throw new Error("Fail to find target account");
            }
        }

        let confirmedAt : Date = new Date();

        const to_hash = {
            namespaceCode: this.namespaceCode,
            target: this.namespaceAccountTarget || '',
            type: this.type,
            amount: Math.abs(this.amount),
            origin: this.namespaceAccountOrigin || '',
            confirmedAt
        }

        const hash = bcrypt.hashSync( JSON.stringify(to_hash) + originPassword || '', 10 );
        
        await db.transaction().execute( async (trx) => {
            if( accountSource ){
                await trx.updateTable('NamespaceAccount').set((eb)=>({
                    balance: eb('balance','-',Math.abs(this.amount))
                })).where('id','=',accountSource.id)
                .executeTakeFirstOrThrow();
            }
            await trx.updateTable('Transaction').set({ confirmedAt, hash, status: 'confirmed' }).where('id','=',this.id).executeTakeFirstOrThrow();
            
            if( accountTarget ){
                await trx.updateTable('NamespaceAccount').set((eb)=>({
                    balance: eb('balance','+', Math.abs(this.amount))
                })).where('id','=',accountTarget.id)
                .executeTakeFirstOrThrow();
                
                await trx.insertInto('Transaction').values({
                    type: this.type,
                    amount: Math.abs(this.amount),
                    headline: this.headline,
                    details: this.details,
                    namespaceCode: this.namespaceCode,
                    namespaceAccount: accountTarget.accountNumber,
                    namespaceAccountOrigin: this.namespaceAccountOrigin,
                    namespaceAccountTarget: this.namespaceAccountTarget,
                    createdAt: this.createdAt,
                    confirmedAt,
                    hash,
                    status: "confirmed"
                }).executeTakeFirstOrThrow();
            }
        }).catch( async (err)  => {
            throw new Error("Fail to make transaction")
        });

        this.confirmedAt = confirmedAt;
        this.hash = hash;
        this.status = "confirmed";

        return this;
    }

    async cancel(){
        if( this.status != 'pending' ){ 
            throw new Error("Cannot cancel this transaction");
        }
        await db.updateTable('Transaction').set({ status: 'cancelled' }).where('id','=',this.id).executeTakeFirst();
    }
}