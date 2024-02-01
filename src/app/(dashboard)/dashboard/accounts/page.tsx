import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import { User } from "@/lib/controller/user";
import { Metadata } from "next";
import { Accounts } from "./accounts";
import { AccountsSqueleton } from "./accounts.component";
import { AccountWidget } from "./account";

export const metadata: Metadata = {
  title: "Contas",
};

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("./");
  }

  const user_session: any = session.user;
  const user = await User.get(user_session.id);
  if (!user) {
    redirect("./");
  }

  let namespaces = await user.getNamespaces();

  if (namespaces.length === 0) {
    return (
      <div className="flex-1 w-full flex p-6 flex-col lg:flex-row gap-6 items-stretch">
        <div className="flex flex-col flex-1 gap-6">Crie seu primeiro mime</div>
      </div>
    );
  }

  const namespaceIndex = searchParams.namespaceIndex
    ? parseInt(searchParams.namespaceIndex as string)
    : 0;
  const idRef = searchParams["id"] as string;

  let accountSelected = null;
  const { precision } = await namespaces[namespaceIndex].getLimits();

  if (idRef) {
    try {
      accountSelected = await namespaces[namespaceIndex].getAccountById(idRef);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex-1 w-full flex flex-row gap-6 overflow-auto p-6 relative max-h-[calc(100dvh-4rem)]">
      <Suspense fallback={<AccountsSqueleton />}>
        <Accounts namespaceIndex={namespaceIndex} />
      </Suspense>
      <AccountWidget data={accountSelected} precision={precision} />
    </div>
  );
}
