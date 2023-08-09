import bcrypt from 'bcrypt'

import { db } from "../database";
import { Account } from './account';
import { validateDigit } from '../core';
import { jsonObjectFrom } from 'kysely/helpers/postgres';
import jwt from 'jsonwebtoken';

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

        const account = await db.selectFrom('account').selectAll().where(({eb,and})=>and([
            eb('account_number','=',account_number),
            eb('namespace_code','=',namespace_code)
        ])).executeTakeFirst()

        if( account == null ){
            return {
                status: 404,
                messsage: "Account not founded."
            }
        }

        if( account.account_password == null ){
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
            .selectFrom('account')
            .innerJoin('customer','customer.id','account.id_customer')
            .select((eb) => [
                jsonObjectFrom( eb.selectFrom('account').selectAll() ).as('account'),
                jsonObjectFrom( eb.selectFrom('customer').selectAll() ).as('customer')
            ]).where(({eb,and})=>and([
                eb('account_number','=',account_number),
                eb('namespace_code','=',namespace_code)
            ]))
            .executeTakeFirst()

        if( !data || data?.account == null ){
            throw new Error('Account not founded.');
        }

        if( data.account.account_password == null ){
            throw new Error('Account has not set a password.');
        }

        const result = bcrypt.compareSync( password, data.account.account_password || '' )
        const token = {
            code: data.account.namespace_code,
            numer: data.account.account_number,
            digit: data.account.account_key,
            status: data.account.status,
            customer: {
                name: data.customer?.name,
                email: data.customer?.email,
                document: data.customer?.document,
                status: data.customer?.status,
                birtday: data.customer?.birthday
            }
        }

        return jwt.sign( token , process.env.SECRET_KEY || 'COLOCA_UM_SECRET', {
            expiresIn: '1h'
        });
    }

    static async SetPassword( namespace_code : string, number:string, password : string, token: string ){
        const account_number = validateDigit( number );

        if( !account_number ){
            throw new Error('Account number digit is not valid.');
        }

        const account = await db.selectFrom('account').selectAll().where(({eb,and})=>and([
            eb('account_number','=',account_number),
            eb('namespace_code','=',namespace_code)
        ])).executeTakeFirst()

        if( account == null ){
            throw new Error("Account not founded.")
        }

        if( account.account_password != null ){
            throw new Error("Account has setted password.")
        }

        const account_password = bcrypt.hashSync( password, bcrypt.genSaltSync( 10 ) )

        try{
            const updated = await db.updateTable('account')
                .set({
                    account_password,
                    updated_at: new Date() 
                })
                .where('id','=',account.id)
                .executeTakeFirstOrThrow();
    
            return updated;
        }catch(err:any){
            throw new Error("Fail to set password.")
        }
    }
}