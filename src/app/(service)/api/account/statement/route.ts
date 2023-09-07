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

    const { searchParams } = new URL(request.url)
    const _start = searchParams.get('start')
    const _days = searchParams.get('days')

    let start_timestamp : number = 0;
    let end_timestamp : number = 0;

    if( _start ){
        start_timestamp = parseInt( _start );
    }else{
        start_timestamp = new Date().setDate( new Date().getDate() - 30 );
    }

    if( _days ){
        end_timestamp = start_timestamp + 1000 * 60 * 60 * 24 * parseInt( _days );
    }else{
        if( _start ){
            end_timestamp = start_timestamp + 1000 * 60 * 60 * 24 * 30;
        }else{
            end_timestamp = new Date().getTime();
        }
    }

    try {
        const start : Date = new Date(start_timestamp);
        start.setHours(0)
        start.setMinutes(0)

        const end : Date = new Date(end_timestamp);
        end.setHours(23)
        end.setMinutes(59)

        return NextResponse.json({
            data: await auth.namespace.getTransactions( auth.account, start, end ),
            status: 200,
            timestamp: new Date().getTime()
        });
    } catch (error : any) {
        NextResponse.json({
            status: 401,
            message : error.message,
            timestamp: new Date().getTime()
        },{ status : 401 })
    }
}