import {
  DashboardButton,
  LoginButton,
  LogoutButton,
  ProfileButton,
  RegisterButton,
} from "@/components/auth/buttons.components";

export default function Home() {
  return (
    <main className="h-full flex items-center justify-center">
      <div className="flex gap-3">
        <ProfileButton />
        <DashboardButton />
        <LoginButton />
        <RegisterButton />
        <LogoutButton />
      </div>
    </main>
  );
}
