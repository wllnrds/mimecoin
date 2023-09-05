import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

        const data = await db
            .selectFrom('NamespaceAccount')
            .selectAll()
            .where(({eb,and})=>and([
                eb('accountNumber','=',account_number),
                eb('namespaceCode','=',namespace_code)
            ])).executeTakeFirst()
        if( !data ){
            throw new Error('Account not founded.');
        }

        const customer = await db.selectFrom('Customer').selectAll().where('id','=',data?.idCustomer).executeTakeFirst();

        if( data.accountPassword == null ){
            throw new Error('Account has not set a password.');
        }

        const result = bcrypt.compareSync( password, data.accountPassword || '' )

        if( !result ){
            throw new Error('Password is invalid');
        }

        const namespace = await db.selectFrom('Namespace').select('id').where('code','=',namespace_code).executeTakeFirstOrThrow();

        const token = {
            id: data.id,
            code: data.namespaceCode,
            number: data.accountNumber,
            digit: data.accountKey,
            customer: {
                name: customer?.name,
                email: customer?.email,
                document: customer?.document,
                status: customer?.status,
                birtday: customer?.birthday
            }
        }

        return {
            token: jwt.sign( token , namespace.id, { expiresIn: '1h' }),
            user: token
        };
    }

    static async SetPassword( id:string, idCustomer:string, namespaceCode : string, number:string, password : string ){
        const accountNumber = validateDigit( number );

        if( !accountNumber ){
            throw new Error('Account number digit is not valid.');
        }

        const account = await db.selectFrom('NamespaceAccount').selectAll().where(({eb,and})=>and([
            eb('id','=',id),
            eb('idCustomer','=',idCustomer),
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
                    status: 'active',
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