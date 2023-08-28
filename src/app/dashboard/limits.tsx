import { authOptions } from "@/lib/auth";
import { User } from "@/lib/controller/user";
import { getServerSession } from "next-auth";
import { LimitsWidget } from "./limits.component";
import { PiPInfos } from "./pip.component";

export async function Limits({ namespaceIndex = 0 }){
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
    const limit_namespace = await namespace.getLimits();

    return <div>
        <PiPInfos namespace={ namespace } user={ user_session } />
        <LimitsWidget precision={ limit_namespace.precision } total={ limit_namespace.max } used={ limit_namespace.used } />
    </div>
}