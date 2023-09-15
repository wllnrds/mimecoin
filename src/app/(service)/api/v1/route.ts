import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest){
    const session = await getServerSession(authOptions);

    if( !session || !session.user ){
        return NextResponse.json({
            message: "Session is invalid",
            status: 401,
            timestamp: new Date().getTime()
        });
    }

    return NextResponse.json({
        data: {},
        message: "Request para a API account",
        status: 200,
        timestamp: new Date().getTime()
    });
}