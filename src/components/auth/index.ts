;import { Namespace } from "@/lib/controller/namespace";
import { NextResponse, type NextRequest } from "next/server";

export async function TokenAuth(request: NextRequest){
    let token = request.headers.get('X-Integration-Token');
    let secret = request.headers.get('X-Integration-Secret');

    console.time("Token check");

    let result = await Namespace.CheckToken( token || '', secret || '');

    console.timeEnd("Token check");

    return {
        namespace: result
    };
}

export async function UserAuth(request: NextRequest){
    let token = request.headers.get('X-Integration-Token');
    let secret = request.headers.get('X-Integration-Secret');
    let resource = request.headers.get('X-Resource-Token');

    console.time("Token check");

    let namespace = await Namespace.CheckToken( token || '', secret || '');

    console.timeEnd("Token check");

    return {
        namespace,

    };
}

class AccessToken{
    
}

function Response ( message:string , status : number ){
    // .json({ message },{ status })
  return NextResponse.next({
    status,
    statusText: message,

  })
}