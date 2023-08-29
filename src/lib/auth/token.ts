import {  type NextRequest } from "next/server";
import { Namespace } from "@/lib/controller/namespace";

export async function TokenAuth(request: NextRequest) {
    let authorization = request.headers.get('authorization');
    
    if( !authorization ){
        throw new Error("Missing authorization")
    }

    const auth = authorization.split(' ');
    let token;
    switch (auth[0]) {
        case 'Bearer':
            if(!auth[1]){
                throw new Error("Missing token")
            }
            token = auth[1];
            break;
        default:
            throw new Error("Missing bearing token")
    }

    return await Namespace.CheckToken(token);
}

export async function UserAuth(request: NextRequest) {
    let auth = await TokenAuth( request );

    if( auth.account.error ){
        throw new Error( auth.account.error )
    }

    if( !auth.account ){
        throw new Error("User token not working")
    }

    return auth;
}