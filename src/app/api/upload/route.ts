import { authOptions } from "@/utils/authOptions";
import { db } from "@/utils/sqlite";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmdirSync, unlinkSync, writeFileSync } from "fs";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

const CHUNK_DIR = './chunks';

export async function POST(request: Request){
    const session = await getServerSession(authOptions);
    if(!session) return new Response('Unauthorized', { status: 401 });

    const formData = await request.formData();

    const blob = formData.get('file') as Blob;
    const path = formData.get('name') as string;
    const totalChunk = formData.get('totalChunk') as string;
    const currentChunk = formData.get('currentChunk') as string;

    const pathWithNoStart = path.startsWith('/') ? path.slice(1) : path;

    // existsSync(CHUNK_DIR) || mkdirSync(CHUNK_DIR, { recursive: true });
    const buffer = await blob.arrayBuffer();
    const buff = Buffer.from(buffer);

    existsSync(`${CHUNK_DIR}/${pathWithNoStart}`) || mkdirSync(`${CHUNK_DIR}/${pathWithNoStart}`, { recursive: true});

    writeFileSync(`${CHUNK_DIR}/${pathWithNoStart}/${currentChunk}`, buff);

    const allFiles = readdirSync(`${CHUNK_DIR}/${pathWithNoStart}`);
    if(allFiles.length == parseInt(totalChunk)) await chunkAssembler(path, parseInt(totalChunk));

    revalidatePath('/');

    return new Response('OK', { status: 200 });
}

async function chunkAssembler(path: string, totalChunks: number){ 
    const chunks = [];
    for(let i = 1; i <= totalChunks; i++){
        const chunkPath = `${CHUNK_DIR}/${path}/${i}`;
        try {
            const chunk = readFileSync(chunkPath);
            chunks.push(chunk);
            unlinkSync(chunkPath);
        } catch(err){
            console.log(err);
        }
    }

    rmdirSync(`${CHUNK_DIR}/${path}`, { recursive: true });

    const data = Buffer.concat(chunks);

    try {
        db.prepare('INSERT INTO gallery_images(path, data) VALUES (?,?)').run(`${path}`, data);
    } catch(err){
        console.log(err);
    }
}