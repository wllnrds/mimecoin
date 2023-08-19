import { User } from "@/lib/controller/user";
import { Link } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function Accounts({ namespaceIndex = 0 }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return;
    }

    const user_session: any = session.user;
    const user = await User.get(user_session.id);
    if (!user) {
        return;
    }
    const namespaces = await user.getNamespaces();
    const namespace = namespaces[namespaceIndex];
    const accounts = await namespace.getAccounts();

    return accounts.map( account => <div className="p-4 bg-white text-tiny rounded-2xl">
        <div className="flex space-x-4 items-center">
            <div className="rounded-full bg-secondary text-white h-8 w-8 flex items-center justify-center">{ account.name.split(" ").map( i => i[0] ).join("").substring(0,2) }</div>
            <div className="flex-1 py-1">
                <div className="font-bold">{ account.name }</div>
                <div>{ account.accountNumber }-{ account.accountKey }</div>
            </div>
        </div>
    </div>)
};

export function AccountsSqueleton() {
    function Item(){
        return  <div className="bg-secondary-50 rounded-2xl p-4">
            <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-secondary h-8 w-8"></div>
                <div className="flex-1 space-y-1 py-1">
                    <div className="h-3 bg-secondary w-16 rounded"></div>
                    <div className="h-2 bg-secondary max-w-72 rounded"></div>
                </div>
            </div>
        </div>
    }

    return <>
        <Item />
        <Item />
        <Item />
    </>
}