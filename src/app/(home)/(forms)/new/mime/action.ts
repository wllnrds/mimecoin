'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Namespace } from "@/lib/controller/namespace";

export async function CheckCode( code : string ){
    const has = await Namespace.getByCode( code.toLowerCase() ).then( result => true ).catch( err => false );
    return has;
}

export async function CreateNamespace( formdata : FormData ){
    const session = await getServerSession(authOptions);

    if( !session ){
        throw new Error("Missing session");
    }

    const user : any = session.user;

    const newMime : {
        name: string,
        code: string,
        precision: number
    } = {
        name: formdata.get('name')?.toString() || "",
        code: formdata.get('code')?.toString() || "",
        precision: parseInt( formdata.get('precision')?.toString() || "0" ),
    }
    
    let missing = [];
    if( newMime.name.length == 0 ){
        missing.push("nome")
    }
    if( newMime.code.length == 0 ){
        missing.push("código")
    }

    if( missing.length > 0 ){
        return { error: `Preencha os campos faltantes: ${ missing.join(', ') }` }
    }

    try{
        const result = await Namespace.create( newMime.code, '', newMime.name, newMime.precision, user.id );
        return {
            id: result.id,
            code: result.code,
            name: result.name,
            precision: newMime.precision
        };
    }catch( err : any ){
        return { error: err.message };
    }
}