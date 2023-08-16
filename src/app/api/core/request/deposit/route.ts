import { TokenAuth } from "@/lib/auth/token";
import { NextResponse, NextRequest } from "next/server";

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

    const { account , headline, description, amount } : {
        account : string ,
        headline: string,
        description : string, 
        amount : number
    } = await request.json();

    try{
        if( account == null || account == '' ){
            throw new Error("All fields should be setted.");
        }

        if( amount <= 0 ){
            throw new Error("Amount must be higher than 0");
        }
    }catch( error : any ){
        return NextResponse.json({
            status: 400,
            message : error.message,
            timestamp: new Date().getTime()
        },{ status : 400 })
    }

    try{
        const data = await auth.namespace.deposit( account, amount, 'deposit', headline, description );
        return NextResponse.json({
            data,
            status: 200,
            message: "Request para a API account",
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