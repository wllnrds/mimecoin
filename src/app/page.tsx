import {
  DashboardButton,
  LoginButton,
  LogoutButton,
  RegisterButton,
} from "@/components/auth/buttons.components";
import { authOptions } from "@/lib/auth";
import { User } from "@/lib/controller/user";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if( session ){
    const user_session : any = session.user;
    const user = await User.get( user_session.id );
    if( user ){
      return redirect('/dashboard');
    }
  }

  return (
    <main className="flex items-center justify-center">
      <div className="flex gap-3">
        <DashboardButton />
        <LoginButton />
        <RegisterButton />
        <LogoutButton />
      </div>
    </main>
  );
}
