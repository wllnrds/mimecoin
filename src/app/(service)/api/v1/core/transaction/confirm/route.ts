import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest){
    const { transaction, password, code } : {
        transaction? : string ,
        password? : string, 
        code? : string
    } = await request.json();
}