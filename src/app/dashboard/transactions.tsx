import { authOptions } from "@/lib/auth";
import { User } from "@/lib/controller/user";
import { getServerSession } from "next-auth";

export async function Transactions({ namespaceIndex = 0 }){
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
    const transactions = await namespace.getRootTransactions();

    return transactions.map( tra => <div className="p-2 rounded-2xl hover:bg-secondary-50 text-tiny">
        <div className="flex space-x-4 items-center">
            <div className="rounded-full bg-secondary text-white h-8 w-8 flex items-center justify-center">{ tra.confirmedAt?.getDay() || "??" }</div>
            <div className="flex-1 py-1 space-y-1">
                <div className="uppercase text-secondary-600">{ tra.type }</div>
                <div className="flex">
                    <div className="flex-1 font-bold">{ tra.headline }</div>
                    <div className={ tra.amount < 0 ? "text-danger" : "text-success-50" }>₼ { tra.amount }</div>
                </div>
                <div>{ tra.details }</div>
            </div>
        </div>
    </div>)

    return <div>Transações</div>
}