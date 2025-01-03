// import { readdirSync, readFileSync } from "fs";
// import { db } from "./utils/sqlite";

// export async function register(){
//     console.log('registering instrumentation');
//     const create_table = "CREATE TABLE IF NOT EXISTS images('name' varchar, 'folder' varchar, 'data' blob );"
//     db.exec(create_table);

//     const pull_data = "INSERT INTO images('name', 'folder', 'data') VALUES (?,?,?);"
//     const dirs = readdirSync('./files/gallery');
//     for(const dir of dirs){
//         const data = readdirSync(`./files/gallery/${dir}`);
//         for(const file of data){
//             const exists = db.prepare('SELECT * FROM images WHERE name = ? and folder = ?').get(file, dir);
//             if(exists) continue;
//             const file_data = readFileSync(`./files/gallery/${dir}/${file}`);
//             try {
//                 db.prepare(pull_data).run(file, dir, file_data);
//             } catch(err){
//                 console.log('error', dir, file, err);
//             }
//         }
//     }

//     console.log('done');
// }