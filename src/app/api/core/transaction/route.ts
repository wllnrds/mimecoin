import { TokenAuth } from "@/lib/auth/token";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest){
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

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if( !id ){
        return NextResponse.json({
            status: 400,
            message : "Missing transaction id",
            timestamp: new Date().getTime()
        },{ status : 400 })
    }

    console.log( id );

    const transaction = await auth.namespace.getTransactionById( id );

    if( !transaction ){
        return NextResponse.json({
            status: 404,
            message : "Transaction not founded",
            timestamp: new Date().getTime()
        },{ status : 404 })
    }
    
    return NextResponse.json({
        status: 200,
        data: transaction,
        message : "Transaction entry",
        timestamp: new Date().getTime()
    },{ status : 200 })
}