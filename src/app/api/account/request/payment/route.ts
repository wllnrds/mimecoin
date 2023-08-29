import { UserAuth } from "@/lib/auth/token";
import { PaymentOrder } from "@/lib/controller/paymentOrder";
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

    let { id, password, headline = null, details = null } : {
        id : string,
        password: string,
        headline : string | null,
        details : string | null,
    } = await request.json();

    const order : PaymentOrder = await auth.namespace.getPaymentOrderById( id );

    if( !order ){
        return NextResponse.json({
            status: 404,
            message : "Missing payment order",
            timestamp: new Date().getTime()
        },{ status : 404 }) 
    }

    try{
        if( id == null || id == '' ){
            throw new Error("Must have target account.");
        }
        if( password == null || password == '' ){
            throw new Error("Must have account password.");
        }
    }catch( error : any ){
        return NextResponse.json({
            status: 400,
            message : error.message,
            timestamp: new Date().getTime()
        },{ status : 400 })
    }

    if(!auth.account.accountNumber){
        return NextResponse.json({
            status: 400,
            message : "Missing source account number",
            timestamp: new Date().getTime()
        },{ status : 400 })
    }

    if( !headline ){
        headline = `Bill Payment`;
    }

    if( !details ){
        details = `Refer to ${ order.digits }`;
    }

    try{
        const transaction = await auth.namespace.payment( auth.account.accountNumber, id, headline, details );
        
        const result = await transaction.Sign({
            originPassword: password,
            cancelIfFail: true,
            inTransaction: () => order.confirm()
        });

        return NextResponse.json({
            data: result,
            status: 200,
            message: "Payment confirmed",
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