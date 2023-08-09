import bcrypt from 'bcrypt'

import { db } from "../database";
import { Status } from "@/lib/database/db"
import { Namespace } from "./namespace";

export class User{
    id: number;
    name: string | null
    email: string | null
    password: string | null
    status: Status | null
    created_at: Date | null
    updated_at: Date | null

    constructor( id: number, name: string | null, email: string | null, password: string | null, status: Status | null, created_at: Date | null, updated_at: Date | null ){
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.status = status;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static async get( id: number ){
        const entry = await db.selectFrom('user').selectAll().where('id','=',id).executeTakeFirst();

        if(!entry){
            throw new Error("Entry not founded.");
        }

        return User.DbToObj( entry );
    }

    static async create( user : {
        email:string,
        name:string,
        password:string
    }){
        const password = bcrypt.hashSync( user.password, bcrypt.genSaltSync( 10 ) )
        const entry = await db.transaction().execute( async (trx) => {
            const r = await trx.insertInto('user').values({
                name: user.name,
                email: user.email,
                password,
                status: "active"
            }).returningAll().executeTakeFirstOrThrow();

            await trx.insertInto('user_limit').values({
                id_user: r.id
            }).executeTakeFirstOrThrow();

            return r;
        });

        return User.DbToObj(entry);
    }

    async getLimit(){
        const limits = await db.selectFrom('user_limit').select('max_namespace').where(({ eb , and, or })=>and([
            eb('id_user','=',this.id),
            eb('active','=',true),
            or([
                eb('expires_at','>',new Date()),
                eb('expires_at','is', null),
            ]),
        ])).execute();

        const maxNamespaces = limits.reduce(( final, crr ) => final + ( crr.max_namespace || 0 ), 0 );

        const current = (await db.selectFrom('namespace').selectAll().where('created_by','=',this.id).execute()).length;

        return {
            max: maxNamespaces,
            used: current,
            current: maxNamespaces - current
        };
    }

    async createNamespace( code : string, pic : string | '', name: string, precision: number | 2 ){
        const limit = await this.getLimit();

        if( limit.current <= 0 ){
            throw new Error("User with no limit to create news namespaces");
        }

        if( code.length != 3 ){
            throw new Error("Namespace.code must to be length 3");
        }

        if( name.length < 4 ){
            throw new Error("Namespace.name must to be at least length 4");
        }

        const entry = await Namespace.create( code, pic, name, precision, this.id );
        return entry;
    }
    async getNamespaces(){
        const namespaces = await db.selectFrom('namespace').innerJoin('user_namespace','user_namespace.id_namespace','namespace.id').selectAll().where('user_namespace.id_user','=',this.id).execute();       
        return namespaces.map( item => Namespace.DbToObj(item) );
    }

    async createAcessToken( idNamespace : number, expires_at : Date ){
        const entry = await db.selectFrom('namespace')
            .innerJoin('user_namespace','user_namespace.id_namespace','namespace.id')
            .selectAll()
            .where(({eb, and})=>and([
                eb('user_namespace.id_user','=',this.id),
                eb('user_namespace.id_namespace','=',idNamespace),
            ]))
            .executeTakeFirstOrThrow();
        const namespace = Namespace.DbToObj( entry );
        return await namespace.createAcessToken( this.id, expires_at );
    }

    static DbToObj( data: any ){
        return new User(
            data.id,
            data.name,
            data.email,
            data.password,
            data.status,
            data.created_at,
            data.updated_at
        )
    }
}