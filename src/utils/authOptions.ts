import { randomBytes } from "crypto";
import { AuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials"


export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Username and Password',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "username" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                console.log('AUTHORIZINGV', credentials, req);
                return null;
            }
        }),
    ],
    session: {
        strategy: "jwt",
        generateSessionToken: () => {return randomBytes(32).toString('hex')}
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, token }: { session: Session, token: JWT }) {
            console.log('SESSION', session, token);
            return session
        },
    },
    debug: true
}