import bcrypt from "bcrypt";
import fs from "fs";

const saltRounds = 10;

export async function handleSignIn(username: string, password: string){
    let credentials = '';
    try {
        credentials = fs.readFileSync('credentials.json', 'utf-8');
    } catch(err){
        fs.writeFileSync('credentials.json', '{}');
        credentials = '{}';
        console.log('Created credentials.json');
    }

    const foundUser = JSON.parse(credentials)[username];
    if(!foundUser) return { valid: false, role: 'error' };
    const { hash } = foundUser;
    let { role } = foundUser;
    const valid = bcrypt.compareSync(password, hash);
    if(!role) role = 'user';
    return { valid, role };
}

export function hashAndSalt(password: string) {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return { hash };
}
