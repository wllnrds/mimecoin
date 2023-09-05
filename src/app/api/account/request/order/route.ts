import { UserAuth } from "@/lib/auth/token";
import { Transaction } from "@/lib/controller/transation";
import { Actions, Logging } from "@/lib/core/logging";
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
    
    await Logging({ 
        namespaceCode: auth.namespace.code,
        action: Actions.paymentCreated,
        payload: { 
            id : _order.id,
        }
    })

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