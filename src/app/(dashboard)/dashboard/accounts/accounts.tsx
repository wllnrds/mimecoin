import { User } from "@/lib/controller/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AccountsWidget } from "./accounts.component";

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

    return <AccountsWidget accounts={ accounts } />
};