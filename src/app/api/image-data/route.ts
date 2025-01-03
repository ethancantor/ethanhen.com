
import { db } from "@/utils/sqlite";
import { NextRequest } from "next/server";
import sharp from 'sharp';

export async function GET(request: NextRequest){
    const { searchParams } = new URL(request.url);
    const imageName = searchParams.get('image');
    const imageFolder = searchParams.get('folder');

    const data = db.prepare('SELECT * FROM images WHERE name = ? and folder = ?').get(imageName, imageFolder) as { name: string, folder: string, data: Buffer };
    const metadata = await sharp(data.data).metadata();

    return new Response(JSON.stringify(metadata), { status: 200 });
} 