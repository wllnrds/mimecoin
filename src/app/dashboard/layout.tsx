import { DashboardButton, LoginButton, LogoutButton, RegisterButton, SettingsButton } from "@/components/auth/buttons.components";
import { Namespaces } from "./namespaces.component";

export default async function Home({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col lg:grid 2xl:grid-cols-8 md:grid-cols-4 bg-foreground overflow-hidden">
      <aside className="border-r-1 border-foreground-600 p-6 flex flex-col gap-6 bg-foreground-800 max-h-screen sticky">
        <menu className="flex flex-col gap-3">
          <DashboardButton />
          <SettingsButton />
          <div className="border-b-1"></div>
          <LoginButton />
          <RegisterButton />
          <LogoutButton />
        </menu>
        <div className="hidden flex-1 lg:block"></div>
        <Namespaces />
      </aside>
      <main className="flex-1 flex md:col-span-3 2xl:col-span-7 overflow-auto">{ children }</main>
    </div>
  )
}