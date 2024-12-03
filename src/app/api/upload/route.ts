import { authOptions } from "@/utils/authOptions";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { getServerSession } from "next-auth";

export async function POST(request: Request){
    const session = await getServerSession(authOptions);
    if(session?.user?.role !== 'admin') return new Response('Unauthorized', { status: 401 });

    const formData = await request.formData();

    const files = formData.getAll('file') as File[];
    const folder = formData.get('folder') as string;

    for(const file of files){
        if(!file) continue;
        const buffer = await file.arrayBuffer();
        const buff = Buffer.from(buffer);
        existsSync(`${folder}`) || mkdirSync(`${folder}`, { recursive: true });
        let fileNumber = 0;
        let fileRepeat = '';
        const fileName = file.name.split('.').slice(0, -1).join('.');
        const fileExtention = file.name.split('.').slice(-1)[0];
        while(existsSync(`${folder}/${fileName}${fileRepeat}.${fileExtention}`)){
            fileNumber++;
            fileRepeat = `(${fileNumber})`;
        }
        writeFileSync(`${folder}/${fileName}${fileRepeat}.${fileExtention}`, buff);
        console.log(`${folder}/${fileName}${fileRepeat}.${fileExtention}`);
    }

    return new Response('OK', { status: 200 });
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