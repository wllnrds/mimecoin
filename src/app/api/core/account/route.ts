import { TokenAuth } from "@/components/auth";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest){
    let auth = null;

    try {
        auth = await TokenAuth( request );
    } catch ( error : any ) {
        return NextResponse.json({
            status: 401,
            message : error.message
        },{ status : 401 })
    }

    const { name , email, document, birthday } : {
        name : string ,
        email : string, 
        document : string, 
        birthday : string
    } = await request.json();

    try{

        if(
            name == null || name == '' ||
            email == null || email == '' ||
            document == null || document == '' ||
            birthday == null || birthday == ''
        ){
            throw new Error("All fields should be setted.");
        }
    
        if( name.length < 4 ){
            throw new Error("Name length must be at least 4.");
        }
    
        if( !email.match( /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) ){
            throw new Error("E-mail not seems valid.");
        }
    
        if( document.length !== 11 ){
            throw new Error("Actualy document should be a CPF" );
        }
    
        try{
            Date.parse( birthday )
        }catch( error : any ){
            throw new Error("Birthday is not valid");
        }
    }catch( error : any ){
        return NextResponse.json({
            status: 400,
            message : error.message
        },{ status : 400 })
    }

    try{
        const account = await auth.namespace.createAccount( name , email, document, birthday );
    }catch( error : any ){
        return NextResponse.json({
            status: 400,
            message : error.message
        },{ status : 400 })
    }

    return NextResponse.json({
        data: { ...auth, body : {
            name , email, document, birthday
        } },
        message: "Request para a API account",
        timestamp: new Date().getTime()
    });
}