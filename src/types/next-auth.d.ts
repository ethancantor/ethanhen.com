// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as NextAuth from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string;
            name: string;
        } & DefaultSession["user"];
    }
    interface User {
        id: string;
        name: string;
    }
    interface JWT {
        user: {
            id: string;
            name: string;
        };
    }
}