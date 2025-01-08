
import { db, GALLERY_IMAGE } from "@/utils/sqlite";
import { NextRequest } from "next/server";
import sharp from 'sharp';

export async function GET(request: NextRequest){
    const { searchParams } = new URL(request.url);
    const imageName = searchParams.get('image');
    const quality = parseInt(searchParams.get('quality') || '100');

    const data = db.prepare("SELECT * FROM gallery_images WHERE path = ?").get(imageName) as GALLERY_IMAGE | null | undefined;

    if(!data) return new Response('', { status: 404 });

    const image = sharp(data.data as Buffer);
    const meta = await image.metadata();

    const compressed = await image.jpeg({ quality }).resize({ width: Math.round((meta.width || 0) * (quality / 100)), height: Math.round((meta.height || 0) * (quality / 100)) }).toBuffer();

    return new Response(compressed, { status: 200, headers: { metadata: JSON.stringify(meta) } });
} 