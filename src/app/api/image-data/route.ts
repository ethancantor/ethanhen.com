
import { DB_FILE } from "@/types/db_types";
import { db } from "@/utils/sqlite";
import { NextRequest } from "next/server";
import sharp from 'sharp';

export async function GET(request: NextRequest){
    const { searchParams } = new URL(request.url);
    const imageName = searchParams.get('image');

    const data = db.prepare("SELECT * FROM files WHERE path = ? and type='image'").get(imageName) as DB_FILE | null | undefined;

    if(!data) return new Response('', { status: 404 });

    let metadata = {}
    try {
        metadata = await sharp(data.data as Buffer).metadata();
    } catch(err){}

    return new Response(JSON.stringify(metadata), { status: 200 });
} 