import { Account } from "@/lib/controller/account";
import { Namespace } from "@/lib/controller/namespace";
import { User } from "@/lib/controller/user";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest){  
    // Cria um usuário  
    // const user = await User.create({
    //     name: "Willian Rodrigues",
    //     email: "okaywillian@gmail.com",
    //     password: "12345678"
    // })

    let user:User = await User.get(1);

    // Cria um namespace
    // const namespace = await user.createNamespace('wln','','Wlln Bank',0);

    const limits = await user.getLimit();
    const namespaces = await user.getNamespaces();

    // const token = await user.createAcessToken(namespaces[0].id, new Date('01/01/2025'))
    const token = {
        "key": "mimecoin_0D77ZAix8Xt7tJph",
        "secret": "0D77ZAixU5plG6jAXTp0Hk5e"
    }

    const namespace_limits = [];
    for(const name of namespaces ){
        namespace_limits.push({
            namespace: name,
            limits: await name.getLimits()
        })
    }

    return NextResponse.json({
        data: {
            user,
            limits : limits,
            namespaces: namespace_limits,
            token
        },
        message: "Dados",
        timestamp: new Date().getTime()
    });
}