import { User } from "@/lib/controller/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Page() {
    const session = await getServerSession(authOptions);

    if( !session ){
      return;
    }

    const user_session : any = session.user;
    const user = await User.get( user_session.id );
    if( !user ){
        return;
    }

    let namespaces = await user.getNamespaces();
    let user_limit = await user.getLimit();
    let namespace_limit = await namespaces[0].getLimits();


    function TableData({ data } : { data : any }){
        const keys = Object.keys( data );
        return <div className="border flex-1 p-2 rounded-3xl">
            <table>
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
        </div>;
    }

    return <div className="w-full flex-1 p-6 flex">
        <div className="flex-1 flex-col gap-6 bg-white rounded-3xl p-6 space-y-6">
            <div className="flex gap-6">
                <div className="flex flex-col flex-1 gap-6">
                    <h1 className="text-2xl">Usuário</h1>
                    <TableData data={ user } ></TableData>
                </div>
                <div className="flex flex-col flex-1 gap-6">
                    <h3 className="text-xl">Limites de namespace do usuário</h3>
                    <TableData data={ user_limit } ></TableData>
                </div>
            </div>
            <div className="flex gap-6">
                <div className="flex flex-col flex-1 gap-6">
                    <h2 className="text-2xl">Namespace</h2>
                    <TableData data={ namespaces[0] } ></TableData>
                </div>
                <div className="flex flex-col flex-1 gap-6">
                    <h3 className="text-xl">Limites do Namespace</h3>
                    <TableData data={ namespace_limit } ></TableData>
                </div>
            </div>
        </div>
    </div>;
}