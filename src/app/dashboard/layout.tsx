import { LoginButton, LogoutButton, ProfileButton, RegisterButton } from "@/components/auth/buttons.components";
import { Namespaces } from "./namespaces.component";

export default async function Home({ children }: { children: React.ReactNode }) {
  // const session = await getServerSession(authOptions);

  // if (!session) {
  //   redirect("/api/auth/signin");
  // }

  return (
    <div className="flex-1 grid 2xl:grid-cols-8 md:grid-cols-4 bg-foreground">
      <aside className="border-r-1 border-foreground-600 p-3 flex flex-col gap-3">
        <menu className="flex flex-col gap-3">
          <ProfileButton />
          <RegisterButton />
          <LoginButton />
          <LogoutButton />
        </menu>
        <div className="flex-1"></div>
        <Namespaces />
      </aside>
      <main className="md:col-span-3 2xl:col-span-7 flex flex-row">
      </main>
    </div>
  )
}