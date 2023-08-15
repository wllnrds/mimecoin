import { User } from "@/lib/controller/user";
import { db } from "@/lib/database";
import { Suspense } from "react";

async function GetUser( id : string ){
    return await User.get( id );
}

async function CreatePilotUser( data : { name : string, email : string } ){
    let user:User = await User.create({
        ...data,
        password: "12345678"
    });
    return await GetUser( user.id );
}

async function GetAllUsers(){
    return await db.selectFrom('User').select('id').selectAll().execute();
}

export default async function Page() {
    const _users = await GetAllUsers();
    let user = ( _users.length === 0 ) ? await CreatePilotUser({ email: "w.almeida.w@gmail.com", name: "Willian Rodrigues" }) : await GetUser( _users[0].id );

    let namespaces = await user.getNamespaces();

    if( namespaces.length == 0 ){
        await user.createNamespace('wln','','Wlln Bank',2)
        namespaces = await user.getNamespaces();
    }

    let user_limit = await user.getLimit();
    let namespace_limit = await namespaces[0].getLimits();

    let token = {
        "key":"mimecoin_0D7eicHri0GOWV4U",
        "secret":"0D7eicHrqjjCQDIyc9xQFNwj"
    };

    if( !token ){
        token = await user.createAcessToken(namespaces[0].id, new Date('01/01/2025'))
    }


    function TableData({ data } : { data : any }){
        const keys = Object.keys( data );
        return <table className="border flex-1">
            {
                keys.map( key => {
                    if(typeof data[key] == 'function'){
                        return null;
                    }
                    return <tr key={ key + JSON.stringify( data[key] + Date.now ) }>
                    <th className="text-left px-2 py-1">{ key }</th>
                    <td className=" px-2 py-1">{ typeof data[key] == 'object' ? JSON.stringify( data[key] ) : data[key] }</td>
                </tr>
                })
            }
        </table>
    }

    return (<div className="container mx-auto flex flex-col gap-6">
        <div className="flex gap-3">
            <div className="flex flex-col flex-1">
                <h1 className="text-2xl py-3">Usuário</h1>
                <TableData data={ user } ></TableData>
            </div>
            <div className="flex flex-col flex-1">
                <h2 className="text-2xl py-3">Namespace</h2>
                <TableData data={ namespaces[0] } ></TableData>
            </div>
        </div>
        <hr />
        <div className="flex gap-3">
            <div className="flex flex-col flex-1">
                <h3 className="text-xl py-3">Limites do usuário</h3>
                <TableData data={ user_limit } ></TableData>
            </div>
            <div className="flex flex-col flex-1">
                <h3 className="text-xl py-3">Limites do Namespace</h3>
                <TableData data={ namespace_limit } ></TableData>
            </div>
            <div className="flex flex-col flex-1">
                <h3 className="text-xl py-3">Token</h3>
                <TableData data={ token } ></TableData>
            </div>
        </div>
    </div>);
}