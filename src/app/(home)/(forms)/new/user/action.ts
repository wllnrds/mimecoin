'use server';

import { User } from "@/lib/controller/user";

export async function CreateUser( formdata : FormData ){
    console.log( formdata )
    const newUser : {
        name: string,
        email: string,
        password: string
    } = {
        name: formdata.get('name')?.toString() || "",
        email: formdata.get('email')?.toString() || "",
        password: formdata.get('password')?.toString() || "",
    }

    let missing = [];
    if( newUser.name.length == 0 ){
        missing.push("nome")
    }
    if( newUser.email.length == 0 ){
        missing.push("email")
    }
    if( newUser.password.length == 0 ){
        missing.push("senha")
    }

    if( missing.length > 0 ){
        return { error: `Preencha os campos faltantes: ${ missing.join(', ') }` }
    }

    try{
        const result = await User.create( newUser );
        return result;
    }catch( err : any ){
        let messageTreat = '';

        if( err.message.includes('User_email_key') ){
            messageTreat = 'E-mail já está em uso por um usuário.'
        }else{
            messageTreat = err.message
        }


        return { error: messageTreat };
    }
}