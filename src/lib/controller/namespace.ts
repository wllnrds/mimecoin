import { suid } from 'rand-token'
import bcrypt from 'bcrypt'

import { Status } from "@/lib/database/db"
import { db } from "@/lib/database"
import { Account } from './account'

export class Namespace{
    id: number
    code: string | null
    pic: string | null
    name: string | null
    status: Status | null
    created_at: Date | null
    updated_at: Date | null

    constructor( id: number, code: string | null, pic: string | null, name: string | null, status: Status | null, created_at: Date | null, updated_at: Date | null ){
        this.id = id;
        this.code = code;
        this.pic = pic;
        this.name = name;
        this.status = status;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static async create( code : string, pic : string | '', name: string, precision: number | 2, idUser : number ){
        const entry = await db.transaction().execute( async (trx) => {
            const newEntry = await trx.insertInto('namespace').values({
                code: code,
                name: name,
                pic: pic || '',
                status: "active",
                created_by: idUser
            }).returningAll().executeTakeFirstOrThrow();

            const limit = await trx.insertInto('namespace_limit').values({
                active: true,
                expires_at: null,
                id_namespace: newEntry.id,
                precision: precision,
                max_offer: 100000 * Math.pow(10, precision)
            }).returningAll().executeTakeFirstOrThrow();

            await trx.insertInto('user_namespace').values({
                id_namespace: newEntry.id,
                id_user: idUser,
            }).executeTakeFirstOrThrow();

            return {
                ...newEntry,
                ...limit
            };
        });

        return Namespace.DbToObj(entry);
    }

    static async get( id:number ){
        const entry = await db.selectFrom('namespace').selectAll().where('id','=',id).executeTakeFirst();

        if(!entry){
            throw new Error("Entry not founded.");
        }

        return Namespace.DbToObj(entry);
    }

    async getLimits(){
        const limits = await db.selectFrom('namespace_limit').selectAll().where(({ eb , and, or })=>and([
            eb('id_namespace','=',this.id),
            eb('active','=',true),
            or([
                eb('expires_at','>',new Date()),
                eb('expires_at','is', null),
            ]),
        ])).execute();

        const maxNamespaces = limits.reduce(( final, crr ) => final + ( crr.max_offer || 0 ), 0 );

        const balances = await db.selectFrom('account').select(['balance','balance_extra']).where('namespace_code','=',this.code).execute();
        const current = balances.reduce( (prv,crr) => prv + ( crr.balance || 0 ) + ( crr.balance_extra || 0 ) , 0 );

        return {
            max: maxNamespaces,
            used: current,
            current: maxNamespaces - current
        };
    }

    async createAcessToken( idUser : number, expires_at : Date | null ){
        let token : { key : string, secret : string } = { 
            key: `mimecoin_${ suid(8) }`,
            secret: suid(16)
        };

        const secret = bcrypt.hashSync( token.secret, bcrypt.genSaltSync( 10 ) )
        
        await db.insertInto('access_token').values({
            id_user: idUser,
            id_namespace: this.id,
            key: token.key,
            secret: secret,
            expires_at: expires_at?.toISOString()
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
        const token = await db.selectFrom('access_token').selectAll().where('access_token.key', '=', key ).executeTakeFirst();

        if( !token ){
            throw new Error('Token invalid.')
        }

        const result = bcrypt.compareSync( secret, token.secret || '' )

        if( !result ){
            throw new Error('Secret invalid.')
        }

        if( token.expires_at != null && new Date( token.expires_at ) < new Date() ){
            throw new Error(`Token expired on ${ new Date( token.expires_at ).toLocaleString() }`)
        }

        return await Namespace.get( token.id_namespace || 0 ) ;
    }
}