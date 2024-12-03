import { randomBytes, randomUUID } from "crypto";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { handleSignIn } from "./cryptoAuth";


export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Username and Password',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "username" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const { valid } = await handleSignIn(credentials?.password || '');
                if(!valid) return null;
                return { 
                    id: randomUUID(), name: 'ethan'
                };
            }
        }),
    ],
    callbacks: {
        jwt: ({ token, user }) => {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    name: user.name,
                };
            }
            return token;
        },
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    name: token.name,
                },
            };
        },
    },
    session: {
        strategy: "jwt",
        generateSessionToken: () => randomBytes(32).toString('hex'),
        maxAge: 60 * 60 * 3, // 3 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
        signOut: '/logout',
    },
    debug: true
}