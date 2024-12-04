import { authOptions } from "@/utils/authOptions";
import { createWriteStream, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { getServerSession } from "next-auth";

const CHUNK_DIR = './chunks';

export async function POST(request: Request){
    const session = await getServerSession(authOptions);
    if(!session) return new Response('Unauthorized', { status: 401 });

    const formData = await request.formData();

    const blob = formData.get('file') as Blob;
    const fileName = formData.get('name') as string;
    const folder = formData.get('folder') as string;
    const totalChunk = formData.get('totalChunk') as string;
    const currentChunk = formData.get('currentChunk') as string;

    existsSync(CHUNK_DIR) || mkdirSync(CHUNK_DIR, { recursive: true });
    const buffer = await blob.arrayBuffer();
    const buff = Buffer.from(buffer);
    writeFileSync(`${CHUNK_DIR}/${fileName}.${currentChunk}`, buff);
    const allFiles = readdirSync(`${CHUNK_DIR}`).filter(file => file.startsWith(`${fileName}.`));
    console.log(allFiles.length, totalChunk, fileName, allFiles.length == +totalChunk, `./${folder}/${fileName}`);
    if(allFiles.length == parseInt(totalChunk)) await chunkAssembler(fileName, folder, parseInt(totalChunk));

    return new Response('OK', { status: 200 });
}

async function chunkAssembler(fileName: string, folder: string, totalChunks: number){ 
    console.log('pssing', `./${folder}/${fileName}`)
    const writer = createWriteStream(`./${folder}/${fileName}`);
    for(let i = 1; i <= totalChunks; i++){
        console.log(`${CHUNK_DIR}/${fileName}.${i}`);
        try {
            const chunk = readFileSync(`${CHUNK_DIR}/${fileName}.${i}`);
            writer.write(chunk);

        } catch(err){
            console.log(err);
        }
    }
    writer.close();
    // rmSync(`${CHUNK_DIR}/${fileName}.*`, { recursive: true, force: true });
}

export async function GET(request: Request){
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    try {
        const exists = existsSync(`./files/${path}`);
        if(!exists) return new Response('Not Found', { status: 404 });
        const isDir = statSync(`./files/${path}`).isDirectory();
        let content = null;
        if(isDir) return new Response('Cannot get directory', { status: 403 });
        else content = readFileSync(`./files/${path}`);

        return new Response(content, { status: 200 });

    } catch(err){ return new Response('Error', { status: 500 }); }

}