import { UserAuth } from "@/lib/auth/token";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest){
    let auth = null;

    try {
        auth = await UserAuth( request );
    } catch ( error : any ) {
        return NextResponse.json({
            status: 401,
            message : error.message,
            timestamp: new Date().getTime()
        },{ status : 401 })
    }

    try{
        const data = auth.namespace.getTransactions( auth.account, undefined, undefined, 'pending');

        return NextResponse.json({
            data,
            status: 200,
            message: "Transfer confirmed",
            timestamp: new Date().getTime()
        });
    }catch( error : any ){
        return NextResponse.json({
            status: 400,
            message : error.message,
            timestamp: new Date().getTime()
        },{ status : 400 })
    }
}