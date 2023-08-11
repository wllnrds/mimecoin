import { suid } from 'rand-token';
import bcrypt from 'bcrypt';

import { Status } from "@/lib/database/db";
import { db } from "@/lib/database";
import { Account } from './account';

export class Namespace{
    id: string
    code: string
    pic: string
    name: string 
    status: Status
    created_at: Date
    updated_at: Date

    constructor( id: string, code: string, pic: string, name: string, status: Status, created_at: Date, updated_at: Date ){
        this.id = id;
        this.code = code;
        this.pic = pic;
        this.name = name;
        this.status = status;
        this.created_at = created_at;
        this.updated_at = updated_at;
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

        const maxNamespaces = limits.reduce(( final, crr ) => final + ( crr.maxOffer || 0 ), 0 );

        const balances = await db.selectFrom('NamespaceAccount').select(['balance','balanceExtra']).where('namespaceCode','=',this.code).execute();
        const current = balances.reduce( (prv,crr) => prv + ( crr.balance || 0 ) + ( crr.balanceExtra || 0 ) , 0 );

        return {
            max: maxNamespaces,
            used: current,
            current: maxNamespaces - current
        };
    }

    async createAcessToken( idUser : string, expires_at : Date | null ){
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
            expiresAt: expires_at?.toISOString()
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
            data.created_at,
            data.updated_at
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
}