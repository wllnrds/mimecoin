import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

import { db } from "../database";
import { Account } from './account';
import { validateDigit } from '../core';

export class AuthAccount{
    account: Account

    promisses : Array<Promise<any>> = []

    constructor( account : Account ){
        this.account = account
    }

    async awaitData(){
        await Promise.all( this.promisses )
    }

    static async LoginReady( namespace_code : string, number:string ){
        const account_number = validateDigit( number );

        if( !account_number ){
            throw new Error('Account number digit is not valid.');
        }

        const account = await db.selectFrom('NamespaceAccount').selectAll().where(({eb,and})=>and([
            eb('accountNumber','=',account_number),
            eb('namespaceCode','=',namespace_code)
        ])).executeTakeFirst()

        if( account == null ){
            return {
                status: 404,
                messsage: "Account not founded."
            }
        }

        if( account.accountPassword == null ){
            throw new Error('User has not set a password.');
        }

        return account.status;
    }

    static async Login( namespace_code : string, number:string, password:string ){
        const account_number = validateDigit( number );

        if( !account_number ){
            throw new Error('Account number digit is not valid.');
        }

        const data= await db
            .selectFrom('NamespaceAccount')
            .innerJoin('Customer','Customer.id','NamespaceAccount.idCustomer')
            .select((eb) => [
                jsonObjectFrom( eb.selectFrom('NamespaceAccount').selectAll() ).as('account'),
                jsonObjectFrom( eb.selectFrom('Customer').selectAll() ).as('customer')
            ]).where(({eb,and})=>and([
                eb('accountNumber','=',account_number),
                eb('namespaceCode','=',namespace_code)
            ]))
            .executeTakeFirst()

        if( !data || data?.account == null ){
            throw new Error('Account not founded.');
        }

        if( data.account.accountPassword == null ){
            throw new Error('Account has not set a password.');
        }

        const result = bcrypt.compareSync( password, data.account.accountPassword || '' )

        if( !result ){
            throw new Error('Password is invalid');
        }

        const token = {
            code: data.account.namespaceCode,
            numer: data.account.accountNumber,
            digit: data.account.accountKey,
            status: data.account.status,
            customer: {
                name: data.customer?.name,
                email: data.customer?.email,
                document: data.customer?.document,
                status: data.customer?.status,
                birtday: data.customer?.birthday
            }
        }

        return jwt.sign( token , process.env.NEXTAUTH_SECRET || 'COLOCA_UM_SECRET', {
            expiresIn: '1h'
        });
    }

    static async SetPassword( namespaceCode : string, number:string, password : string, token: string ){
        const accountNumber = validateDigit( number );

        if( !accountNumber ){
            throw new Error('Account number digit is not valid.');
        }

        const account = await db.selectFrom('NamespaceAccount').selectAll().where(({eb,and})=>and([
            eb('accountNumber','=',accountNumber),
            eb('namespaceCode','=',namespaceCode)
        ])).executeTakeFirst()

        if( account == null ){
            throw new Error("Account not founded.")
        }

        if( account.accountPassword != null ){
            throw new Error("Account has setted password.")
        }

        const accountPassword = bcrypt.hashSync( password, bcrypt.genSaltSync( 10 ) )

        try{
            const updated = await db.updateTable('NamespaceAccount')
                .set({
                    accountPassword,
                    updatedAt: new Date() 
                })
                .where('id','=',account.id)
                .executeTakeFirstOrThrow();
    
            return updated;
        }catch(err:any){
            throw new Error("Fail to set password.")
        }
    }
}