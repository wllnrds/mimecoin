import { authOptions } from "@/lib/auth";
import { User } from "@/lib/controller/user";
import { getServerSession } from "next-auth";
import { TransactionsWidget } from "./transactions.component";
import { Transaction } from "@/lib/controller/transation";

export const revalidate = 0;

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
    const transactions = await namespace.getRootTransactions() as any;

    return <TransactionsWidget transactions={ transactions } />
}