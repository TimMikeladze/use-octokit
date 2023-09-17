import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt(token) {
      if (token.trigger === `signIn` || token.trigger === `signUp`) {
        token.token.accessToken = token.account?.access_token;
      }
      return token.token;
    },
    async session(params) {
      params.session.user.accessToken = params.token.accessToken as string;
      return params.session;
    },
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
};
