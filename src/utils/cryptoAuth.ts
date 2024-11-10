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
    if(!foundUser) return false;
    const { hash, salt } = foundUser;
    const check = bcrypt.hashSync(password, salt);
    console.log(check, hash);
    // const valid = bcrypt.compareSync(password, foundUser.hash);
    // console.log(valid, foundUser);
    return false;

    // try {
    //     const data = JSON.parse(credentials);
    //     const { hash, salt }= hashAndSalt(password);
    //     data[username] = { hash, salt };
    //     console.log(data);
    //     fs.writeFileSync('credentials.json', JSON.stringify(data));
        
    // } catch(err){
    //     console.log(err);
    // }
    // return false;
}

export function hashAndSalt(password: string) {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return { hash, salt };
}
