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
    const code = searchParams.get('code')

    if( !code || code.length != 48 ){
        return NextResponse.json({
            status: 400,
            message : "Missing code",
            timestamp: new Date().getTime()
        },{ status : 400 })
    }

    const order = await auth.namespace.getPaymentOrder( code );

    if( !order ){
        return NextResponse.json({
            status: 404,
            data: order,
            message : "Payment not founded",
            timestamp: new Date().getTime()
        },{ status : 404 })
    }

    if( !order.namespaceAccountOrigin ){
        return NextResponse.json({
            status: 400,
            message : "Payment source does not exist",
            timestamp: new Date().getTime()
        },{ status : 400 })
    }

    const account = await auth.namespace.getAccountCustomer( order.namespaceAccountOrigin );
    
    return NextResponse.json({
        status: 200,
        data: {
            order: {
                id: order.id,
                digits: order.digits,
                due: order.due,
                amount: order.amount,
                status: order.status,
                createdAt: order.createdAt
            },
            account
        },
        message : "Payment order",
        timestamp: new Date().getTime()
    },{ status : 200 })
}