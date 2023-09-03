import { UserAuth } from "@/lib/auth/token";
import { Transaction } from "@/lib/controller/transation";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest){
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

    const { target, headline, details, amount } : {
        target : string,
        headline: string,
        details : string, 
        amount : number
    } = await request.json();

    try{
        if( target == null || target == '' ){
            throw new Error("Must have target account.");
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

    if(!auth.account.accountNumber){
        throw new Error("Missing source account number");
    }

    try{
        const data = await auth.namespace.transfer( auth.account.accountNumber, target, amount, headline, details );
        return NextResponse.json({
            data,
            status: 200,
            message: "Transfer requested",
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

export async function PATCH(request: NextRequest){
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

    const { id, password } : {
        id : string,
        password: string
    } = await request.json();

    try{
        if( id == null || id == '' ){
            throw new Error("Must must have an transaction ID to confirm.");
        }

        if( password == null || password == '' ){
            throw new Error("Password required");
        }
    }catch( error : any ){
        return NextResponse.json({
            status: 400,
            message : error.message,
            timestamp: new Date().getTime()
        },{ status : 400 })
    }

    if(!auth.account.accountNumber){
        throw new Error("Missing source account number");
    }

    try{
        const data = await Transaction.getById( auth.namespace.code, id );

        if( data.namespaceAccountOrigin !=  auth.account.accountNumber ){
            throw new Error("Transaction error.");
        }

        if( data.type !== 'transfer' ){
            throw new Error("This transaction cannot be confirmed here");
        }

        await data.Sign({ originPassword: password, cancelIfFail: false })

        const result = await Transaction.dataTansaction( auth.namespace.code, id );

        const { precision } = await auth.namespace.getLimits();

        result.amount = result.amount / ( Math.pow(10, precision) );

        return NextResponse.json({
            data : result,
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