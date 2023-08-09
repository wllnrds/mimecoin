import { TokenAuth } from "@/components/auth";
import { AuthAccount } from "@/lib/controller/auth";
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

    const { account, digit, password, token } : {
        account : string ,
        digit : string, 
        password : string,
        token: string
    } = await request.json();

    if(
        account == null || account == '' ||
        digit == null || digit == '' ||
        password == null || password == '' ||
        token == null || token == ''
    ){
        throw new Error("All fields should be setted.");
    }

    try{
        await AuthAccount.SetPassword( auth.namespace.code, account+digit, password, token )
        return NextResponse.json({
            status: 200,
            message: "Password setted.",
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