import { TokenAuth } from "@/lib/auth/token";
import { WebHook } from "@/lib/core/pubsub";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest){
    let auth = null;

    try {
        auth = await TokenAuth( request );
    } catch ( error : any ) {
        return NextResponse.json({
            status: 401,
            message : error.message,
            timestamp: new Date().getTime()
        },{ status : 401 })
    }

    const { url } : { url : string } = await request.json();

    if( url == null || url == '' || !url.startsWith('https://') ){
        return NextResponse.json({
            status: 400,
            message : "There's no a valid URL to hook",
            timestamp: new Date().getTime()
        },{ status : 400 })
    }

    const result = await WebHook.subscribe({
        namespaceCode: auth.namespace.code,
        hook: { 
            name : auth.namespace.code, 
            url
        }
    });

    return NextResponse.json({
        data: result,
        message: "Webhook request",
        status: 200,
        timestamp: new Date().getTime()
    });
}