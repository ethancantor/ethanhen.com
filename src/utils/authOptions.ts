import { Account, Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const accessEmails = process.env.ACCESS_EMAILS || [] as string[];

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code'
                }
            }
        })
    ],
    callbacks: {
        async signIn( params : { account: Account | null, profile?: Profile | undefined} ) {
            // console.log(params);
            if(params.account?.provider === 'google'){
                const email = params.profile?.email || '';
                console.log(accessEmails, accessEmails.includes(email));
                return (params.profile?.email_verified || false) && accessEmails.includes(email);
            } 
            return false;
        }
    }
}