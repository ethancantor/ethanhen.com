'use server';

import { hashAndSalt } from "@/utils/cryptoAuth";
import { writeFileSync } from "fs";
import {redirect} from "next/navigation";

export async function createAccount(password: string) {
    const { hash } = hashAndSalt(password);
    writeFileSync('credentials.json', JSON.stringify({hash}));

    redirect('/login')
}
