import bcrypt from 'bcrypt'

import { db } from "../database";
import { Status } from "@/lib/database/db"
import { Namespace } from "./namespace";

export class User{
    id: string;
    name: string;
    email: string;
    password: string;
    status: Status;
    created_at: Date;
    updated_at: Date;

    constructor( id: string, name: string, email: string, password: string, status: Status, created_at: Date, updated_at: Date ){
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.status = status;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static async get( id: string ){
        const entry = await db.selectFrom('User').selectAll().where('id','=',id).executeTakeFirst();

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
            const r = await trx.insertInto('User').values({
                name: user.name,
                email: user.email,
                password,
                status: "active"
            }).returningAll().executeTakeFirstOrThrow();

            await trx.insertInto('UserLimit').values({
                idUser: r.id
            }).executeTakeFirstOrThrow();

            return r;
        });

        return User.DbToObj(entry);
    }

    async getLimit(){
        const limits = await db.selectFrom('UserLimit').select('maxNamespace').where(({ eb , and, or })=>and([
            eb('idUser','=',this.id),
            eb('active','=',true),
            or([
                eb('expiresAt','>',new Date()),
                eb('expiresAt','is', null),
            ]),
        ])).execute();

        const maxNamespaces = limits.reduce(( final, crr ) => final + ( crr.maxNamespace || 0 ), 0 );

        const current = (await db.selectFrom('Namespace').selectAll().where('createdBy','=',this.id).execute()).length;

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
        const namespaces = await db.selectFrom('Namespace').innerJoin('UserNamespace','UserNamespace.idNamespace','Namespace.id').selectAll('Namespace').where('UserNamespace.idUser','=',this.id).execute();  
        return namespaces.map( item => Namespace.DbToObj(item) );
    }

    async createAcessToken( idNamespace : string, expires_at : Date ){
        const entry = await db.selectFrom('Namespace')
            .innerJoin('UserNamespace','UserNamespace.idNamespace','Namespace.id')
            .selectAll()
            .where(({eb, and})=>and([
                eb('UserNamespace.idUser','=',this.id),
                eb('UserNamespace.idNamespace','=',idNamespace),
            ]))
            .executeTakeFirstOrThrow();
        const namespace = Namespace.DbToObj( entry );
        return await namespace.createAcessToken( this.id, expires_at );
    }

    static async login( email : string, password : string ){
        const entry = await db.selectFrom('User').selectAll().where('email', '=', email).executeTakeFirst();
        if( !entry ){
            throw new Error("User not founded.")
        }

        const result = bcrypt.compareSync( password, entry.password );

        if( !result ){
            throw new Error("Wrong password.")
        }

        const user : User = User.DbToObj( entry );
        const namespaces = await user.getNamespaces();
        const limits = await user.getLimit();

        return {
            id: entry.id,
            name: entry.name,
            email: entry.email,
            status: entry.status,
            image: entry.image,
            namespaces,
            limits
        }
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