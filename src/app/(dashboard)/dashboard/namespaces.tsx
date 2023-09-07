import { User } from "@/lib/controller/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NamespacesWidget } from "../../../components/namespace/namespaces.component";

export async function Namespaces(){
    const session = await getServerSession(authOptions);

    if( !session ){
      return;
    }

    const user_session : any = session.user;
    const user = await User.get( user_session.id );
    if( !user ){
        return;
    }
    const namespaces = await user.getNamespaces();
    const limit = await user.getLimit();

    return <NamespacesWidget namespaces={ namespaces.flatMap( ns => ({
      id: ns.id,
      code: ns.code,
      pic: ns.pic,
      name: ns.name ,
      status: ns.status,
      createdAt: ns.createdAt,
      updatedAt: ns.updatedAt,
      createdBy: ns.createdBy,
  }) ) } limit={ limit } />
  };
  