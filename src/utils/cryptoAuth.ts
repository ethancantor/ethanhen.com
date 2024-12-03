import bcrypt from "bcrypt";
import fs from "fs";

const saltRounds = 10;

export async function handleSignIn(password: string){
    let credentials = '';
    try {
        credentials = fs.readFileSync('credentials.json', 'utf-8');
    } catch(err){
        fs.writeFileSync('credentials.json', '{}');
        credentials = '{}';
        console.log('Created credentials.json');
    }

    const foundPassword = JSON.parse(credentials).hash;
    if(!foundPassword) return { valid: false };
    const valid = bcrypt.compareSync(password, foundPassword);
    return { valid };
}

export function hashAndSalt(password: string) {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return { hash };
}
