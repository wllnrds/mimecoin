import { User } from "@/lib/controller/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const Namespaces = async () => {
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

    const square_base = "border box-content border-primary rounded-xl aspect-square overflow-hidden justify-center items-center flex";
    const square_inner = "text-xs aspect-square text-primary overflow-hidden justify-center items-center flex w-8 line-clamp-1";

    return (<div className="flex flex-col gap-3">
        <aside className="flex gap-3 justify-start align-middle items-center bg-white rounded-2xl p-2 pl-5">
            <span className="flex-1 text-xs">Seu Mime</span>
            { 
                ( namespaces.length == 0 ) ? 
                    <div className={ `${ square_base } border-dashed` }>
                        <span className={ square_inner }></span>
                    </div> : namespaces.map( namespace => 
                    <a href="/" className={ `${ square_base } hover:bg-primary-50` } title={ namespace.name }>
                        { namespace.pic ? <img src={ namespace.pic } /> : <span className={ square_inner }>{ namespace.code }</span>}
                    </a> )
            }
        </aside>        
        
        {
            ( limit.current > 0 ) && <a className="flex gap-3 justify-start align-middle items-center bg-primary text-primary-foreground rounded-2xl p-2 pl-5 hover:bg-primary-200" title="Novo Mime">
                <span className="material-icon text-primary-foreground text-lg aspect-square flex justify-center items-center">add_circle</span><span className="text-xs">Criar Novo Mime</span>
                </a>
        }   
    </div>
    )
  };
  