// import { User } from "@/lib/controller/user";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest){
    return NextResponse.json({
        message: "Funcionando",
        timestamp: new Date().getTime()
    });
    
    // Cria um usuário  
    // await User.create({
    //     name: "Willian Rodrigues",
    //     email: "okaywillian@gmail.com",
    //     password: "12345678"
    // })

    // let user:User = await User.get(1);

    // Cria um namespace
    // const namespace = await user.createNamespace('wln','','Wlln Bank',0);

    // const limits = await user.getLimit();
    // const namespaces = await user.getNamespaces();

    // const token = await user.createAcessToken(namespace.id, new Date('01/01/2025'))
    
    // LOCALHOST
    // const token = {
    //     "key": "mimecoin_0D77ZAix8Xt7tJph",
    //     "secret": "0D77ZAixU5plG6jAXTp0Hk5e"
    // }


    // VERCEL
    // const token = {
    //     "key": "mimecoin_0D7DMOg4uqmhtNmk",
    //     "secret": "0D7DMOg4MNHrkaU4BmX6DR2G"
    //   }

    // const namespace_limits = [];
    // for(const name of namespaces ){
    //     namespace_limits.push({
    //         namespace: name,
    //         limits: await name.getLimits()
    //     })
    // }

    // return NextResponse.json({
    //     data: {
    //         user,
    //         limits : limits,
    //         namespaces: namespace_limits,
    //         token
    //     },
    //     message: "Dados",
    //     timestamp: new Date().getTime()
    // });
}