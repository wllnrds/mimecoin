import { DashboardButton, LoginButton, LogoutButton, ProfileButton, RegisterButton } from "@/components/auth/buttons.components";
import { Namespaces } from "./namespaces.component";

export default async function Home({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col lg:grid 2xl:grid-cols-8 md:grid-cols-4 bg-foreground">
      <aside className="border-r-1 border-foreground-600 p-6 flex flex-col gap-6 bg-foreground-800">
        <menu className="flex flex-col gap-3">
          <ProfileButton />
          <DashboardButton />
          <LoginButton />
          <RegisterButton />
          <LogoutButton />
        </menu>
        <div className="hidden flex-1 lg:block"></div>
        <Namespaces />
      </aside>
      <main className="flex-1 md:col-span-3 2xl:col-span-7 flex flex-row lg:max-h-screen overflow-hidden">{ children }</main>
    </div>
  )
}