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
                const { valid, role } = await handleSignIn(credentials?.username || '', credentials?.password || '');
                if(!valid) return null;
                return { 
                    id: randomUUID(), name: credentials?.username || '', role
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
                    role: user.role,
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
                    role: token.role,
                },
            };
        },
    },
    session: {
        strategy: "jwt",
        generateSessionToken: () => randomBytes(32).toString('hex'),
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
        signOut: '/logout',
    },
    debug: true
}