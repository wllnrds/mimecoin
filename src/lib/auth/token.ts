import jwt from 'jsonwebtoken';
import {  type NextRequest } from "next/server";
import { Namespace } from "@/lib/controller/namespace";

export async function TokenAuth(request: NextRequest) {
    let token = request.headers.get('X-Integration-Token');
    let secret = request.headers.get('X-Integration-Secret');

    let result = await Namespace.CheckToken(token || '', secret || '');

    return {
        namespace: result
    };
}

export async function UserAuth(request: NextRequest) {
    let { namespace } = await TokenAuth( request );

    let token = request.headers.get('X-Resource-Token')

    if( !token ){
        throw new Error("User token not founded")
    }

    const result : any = jwt.verify( token, process.env.NEXTAUTH_SECRET || 'COLOCA_UM_SECRET' );

    if(!result){
        throw new Error("User token invalid")
    }

    const account = await namespace.getAccount( result.number + result.digit );

    return {
        namespace,
        account
    };
}