import { authOptions } from "@/lib/auth";
import { Namespace } from "@/lib/controller/namespace";
import { User } from "@/lib/controller/user";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest){
    const session = await getServerSession(authOptions);

    if( !session || !session.user ){
        return NextResponse.json({
            message: "Session is invalid",
            status: 401,
            timestamp: new Date().getTime()
        });
    }

    const session_user : any = session.user;

    const { namespace } = await request.json(); 

    const user = await User.get( session_user.id )
    const namespaces = await user.getNamespaces();
    const user_ns = namespaces.find( ns => ns.id == namespace );
    const token = await user_ns?.createAcessToken( session_user.id, null )

    return NextResponse.json({
        data: token,
        message: "Request para a API account",
        status: 200,
        timestamp: new Date().getTime()
    });
}