import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "../controller/user";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider(
      {
        name: "Login",
        credentials: {
          email: { label: "Email", type: "email", placeholder: "usuario@gmail.com" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials.password) {
            return null;
          }

          let user = await User.login( credentials.email, credentials.password ).catch( (error : any) => {
            return null;      
          });

          return user;
        }
      }
    )
  ],
  // pages: {
  //   signIn: "/login",
  //   signOut: "/logout"
  // },
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: { ...session.user, id: token.id }
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;
        return { ...token, id: u.id };
      }
      return token;
    }
  }
};