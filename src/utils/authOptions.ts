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
                console.log('HANDLE SIGN IN');
                const valid = await handleSignIn(credentials?.username || '', credentials?.password || '');
                if(!valid) return null;
                return { 
                    id: randomUUID(), name: credentials?.username || '' 
                };
            }
        }),
    ],
    session: {
        strategy: "jwt",
        generateSessionToken: () => randomBytes(32).toString('hex'),
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login'
    },
    debug: true
}