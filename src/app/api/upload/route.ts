import { authOptions } from "@/utils/authOptions";
import { db } from "@/utils/sqlite";
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

const CHUNK_DIR = './chunks';

export async function POST(request: Request){
    const session = await getServerSession(authOptions);
    if(!session) return new Response('Unauthorized', { status: 401 });

    const formData = await request.formData();

    const blob = formData.get('file') as Blob;
    const fileName = formData.get('name') as string;
    const totalChunk = formData.get('totalChunk') as string;
    const currentChunk = formData.get('currentChunk') as string;

    existsSync(CHUNK_DIR) || mkdirSync(CHUNK_DIR, { recursive: true });
    const buffer = await blob.arrayBuffer();
    const buff = Buffer.from(buffer);
    writeFileSync(`${CHUNK_DIR}/${fileName}.${currentChunk}`, buff);
    const allFiles = readdirSync(`${CHUNK_DIR}`).filter(file => file.startsWith(`${fileName}.`));
    if(allFiles.length == parseInt(totalChunk)) await chunkAssembler(fileName, parseInt(totalChunk));

    revalidatePath('/');

    return new Response('OK', { status: 200 });
}

async function chunkAssembler(fileName: string, totalChunks: number){ 
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
    try {
        console.log('uploading file', `${fileName}`);
        db.prepare('INSERT INTO files(path, data, is_gallery_image) VALUES (?,?,?)').run(`${fileName}`, data, isImage.toString());
    } catch(err){
        console.log(err);
    }
}