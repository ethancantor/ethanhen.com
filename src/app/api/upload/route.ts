import { authOptions } from "@/utils/authOptions";
import { db } from "@/utils/sqlite";
import { createWriteStream, existsSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from "fs";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

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
    if(allFiles.length == parseInt(totalChunk)) await chunkAssembler(fileName, folder, parseInt(totalChunk));

    revalidatePath('/');

    return new Response('OK', { status: 200 });
}

async function chunkAssembler(fileName: string, folder: string, totalChunks: number){ 
    existsSync(`${folder}`) || mkdirSync(`${folder}`, { recursive: true });
    const chunks = [];
    for(let i = 1; i <= totalChunks; i++){
        try {
            const chunk = readFileSync(`${CHUNK_DIR}/${fileName}.${i}`);
            chunks.push(chunk);
            unlinkSync(`${CHUNK_DIR}/${fileName}.${i}`);
        } catch(err){
            console.log(err);
        }
    }
    const data = Buffer.concat(chunks);
    const isImage = fileName.endsWith('png') || fileName.endsWith('jpg') || fileName.endsWith('gif') || fileName.endsWith('jpeg') || fileName.endsWith('webp')
    const type = isImage ? 'image' : 'file';
    try {
        console.log('uploading file', `${folder}/${fileName}`);
        db.prepare('INSERT INTO files(path, data, type) VALUES (?,?,?)').run(`${folder}/${fileName}`, data, type);
    } catch(err){
        console.log(err);
    }
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