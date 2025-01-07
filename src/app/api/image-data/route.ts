
import { db, GALLERY_IMAGE } from "@/utils/sqlite";
import { NextRequest } from "next/server";
import sharp from 'sharp';

export async function GET(request: NextRequest){
    const { searchParams } = new URL(request.url);
    const imageName = searchParams.get('image');

    const data = db.prepare("SELECT * FROM gallery_images WHERE path = ?").get(imageName) as GALLERY_IMAGE | null | undefined;

    if(!data) return new Response('', { status: 404 });

    let metadata = {}
    try {
        metadata = await sharp(data.data as Buffer).metadata();
    } catch(err){}

    return new Response(JSON.stringify(metadata), { status: 200 });
} 