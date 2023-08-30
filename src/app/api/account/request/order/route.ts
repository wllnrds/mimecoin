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

    const { due, amount } : {
        due : string,
        amount: number,
    } = await request.json();

    if( amount <= 0 ){
        throw new Error("Amount must be a positive value");
    }

    const _dueDate = new Date(due);

    if( _dueDate.getTime() < new Date().getTime() ){
        throw new Error("Due must be after now");
    }

    if(!auth.account.accountNumber || !auth.account.accountKey){
        throw new Error("Missing source account number");
    }

    const _order = await auth.namespace.createPaymentOrder(
        auth.account.accountNumber,
        auth.account.accountKey,
        amount,
        _dueDate
    )

    try{
        return NextResponse.json({
            data: _order,
            status: 200,
            message: "Payment order created",
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

    if(!auth.account.acc
        "Missing source account number");
    }

    try{
        const data = await Transaction.getById( auth.namespace.code, id );

        if( data.namespaceAccountOrigin !=  auth.account.accountNumber ){
            throw new Error("Transaction error.");
        }

        if( data.type !== 'transfer' ){
            throw new Error("This transaction cannot be confirmed here");
        }

        const result = await data.Sign({
            originPassword: password,
            cancelIfFail: false
        });

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