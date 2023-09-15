import { UserAuth } from "@/lib/auth/token";
import { NextResponse, type NextRequest } from "next/server";

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

    return NextResponse.json({
        data: await auth.namespace.getBalance( auth.account ),
        status: 200,
        timestamp: new Date().getTime()
    });
}