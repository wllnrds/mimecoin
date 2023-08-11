import type { AuthConfig } from "@auth/core";
import CredentialsProvider from "@auth/core/providers/credentials";

export const authOptions: AuthConfig = {
  pages: { signIn: "/login", },
  session: { strategy: "jwt", },
  providers: [
    CredentialsProvider(
        {
            name: "Login",
            credentials: {
              email: { label: "Email", type: "email", placeholder: "example@example.com" },
              password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
              if (!credentials?.email || !credentials.password) {
                return null;
              }

              let user = {
                id: "",
                email: "",
                name: ""
              }
      
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                randomKey: "Hey cool",
              };
            },
        }
    ),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          randomKey: token.randomKey,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey,
        };
      }
      return token;
    },
  },
};