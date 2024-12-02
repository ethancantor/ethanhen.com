import { authOptions } from "@/utils/authOptions";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
    console.log(request);
    const session = await getServerSession(authOptions);
    if(session?.user?.role !== 'admin') return new Response('Unauthorized', { status: 401 });
    console.log(request);
}

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
        existsSync(`./gallery/${folder}`) || mkdirSync(`./gallery/${folder}`);
        let fileNumber = 0;
        let fileRepeat = '';
        const fileName = file.name.split('.').slice(0, -1).join('.');
        const fileExtention = file.name.split('.').slice(-1)[0];
        while(existsSync(`./gallery/${folder}/${fileName}${fileRepeat}.${fileExtention}`)){
            fileNumber++;
            fileRepeat = `(${fileNumber})`;
        }
        writeFileSync(`./gallery/${folder}/${fileName}${fileRepeat}.${fileExtention}`, buff);
        console.log(`./gallery/${folder}/${fileName}${fileRepeat}.${fileExtention}`);
    }

    return new Response('OK', { status: 200 });
}