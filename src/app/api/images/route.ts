
import { db } from "@/utils/sqlite";
import { NextRequest } from "next/server";
import sharp from 'sharp';

export async function GET(request: NextRequest){
    const { searchParams } = new URL(request.url);
    const imageName = searchParams.get('image');
    const imageFolder = searchParams.get('folder');
    const quality = parseInt(searchParams.get('quality') || '100');

    const data = db.prepare('SELECT * FROM images WHERE name = ? and folder = ?').get(imageName, imageFolder) as { name: string, folder: string, data: Buffer };

    const buff = await sharp(data.data).jpeg({ quality }).toBuffer()
    return new Response(buff, { status: 200 });
} 