'use server';

import { hashAndSalt } from "@/utils/cryptoAuth";
import { readFileSync, writeFileSync } from "fs";

export async function createAccount(username: string, password: string) {
    console.log('Create account attempted with:', { username, password });
    let currentAccounts: Record<string, { hash: string }> = {};
    try {
        currentAccounts = JSON.parse(readFileSync('credentials.json', 'utf-8'));
    } catch(err){}

    if(currentAccounts[username]) return false;
    const { hash } = hashAndSalt(password);

    currentAccounts[username] = { hash };
    writeFileSync('credentials.json', JSON.stringify(currentAccounts));

    return true;
}
