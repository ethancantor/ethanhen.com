import { createReadStream, existsSync, statSync } from "fs";
import { NextRequest } from "next/server";

const MEDIA_ROOT_PATH = './files/gallery';

export async function GET(request: NextRequest){
    const { searchParams } = new URL(request.url);
    const imageCategory = searchParams.get('category');
    const imageName = searchParams.get('image');
    try {
        const exists = existsSync(`${MEDIA_ROOT_PATH}/${imageCategory}/${imageName}`);
        if(!exists) return new Response('Not Found', { status: 404 });
        const isDir = statSync(`${MEDIA_ROOT_PATH}/${imageCategory}/${imageName}`).isDirectory();
        if(isDir) return new Response('Cannot get directory', { status: 403 });
        else {
            const readStream = createReadStream(`${MEDIA_ROOT_PATH}/${imageCategory}/${imageName}`);
            return new Response(readStream as unknown as BodyInit, { status: 200 });
        }
    } catch(err){
        return new Response('Error', { status: 500 });
    }
} 