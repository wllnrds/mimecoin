import { TokenAuth } from "@/lib/auth/token";
import { NextResponse, NextRequest } from "next/server";
import crypto from 'crypto';
import { Actions, Logging } from "@/lib/core/logging";

const encrypt = ( content : string, password : string ) => {
    try {
      const iv = crypto.randomBytes(16);
      const key = crypto.createHash('sha256').update( password ).digest('base64').substr(0, 32);
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
      let encrypted = cipher.update( content);
      encrypted = Buffer.concat([encrypted, cipher.final()])
      return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
      console.error(error);
    }
}

export async function POST(request: NextRequest){
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
            message : error.message,
            timestamp: new Date().getTime()
        },{ status : 400 })
    }

    try{
        const account = await auth.namespace.createAccount( name , email, document, birthday );

        const obj = {
            "id": account.id,
            "idCustomer": account.idCustomer,
            "account": account.accountNumber,
            "digit": account.accountKey
        }

        await Logging({ 
            namespaceCode: auth.namespace.code,
            action: Actions.accountCreated,
            payload: { 
                id : account.id,
            }
        })

        const data = encrypt( JSON.stringify( obj ), process.env.NEXTAUTH_CRYPTO || 'USER_CRYTO_KEY' );

        return NextResponse.json({
            data: { account, passwordUrl: `https://mimecoin.vercel.app/passwordSet?userToken=${ data }` },
            status: 200,
            message: "Account created",
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
    const number = searchParams.get('account')

    if( number == null || number == '' || number.length != 6 ){
        return NextResponse.json({ 
            message: "Missing or invalid account number."
        }, {
            status: 400
        });
    }

    try {
        const account = await auth.namespace.getAccount( number );
        await account.loadCustomer();

        return NextResponse.json({
            code: account?.namespaceCode,
            number: account?.accountNumber,
            digit: account?.accountKey,
            customer: account?.customer!.name,
            document: account?.customer!.document
        },{
            status: 200
        });
    } catch (error : any) {
        return NextResponse.json({ 
            message: error.message
        }, {
            status: 404
        });
    }
}