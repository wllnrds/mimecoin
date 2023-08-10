import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest){
    return NextResponse.json({
        data: { },
        message: "Request para a API account",
        status: 200,
        timestamp: new Date().getTime()
    });
}