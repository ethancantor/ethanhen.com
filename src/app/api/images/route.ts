
import { DB_FILE } from '@/types/db_types';
import { db } from "@/utils/sqlite";
import { NextRequest } from "next/server";
import sharp from 'sharp';

export async function GET(request: NextRequest){
    const { searchParams } = new URL(request.url);
    const imageName = searchParams.get('image');
    const quality = parseInt(searchParams.get('quality') || '100');

    const data = db.prepare("SELECT * FROM files WHERE path = ? and type='image'").get(imageName) as DB_FILE | null | undefined;

    if(!data) return new Response('', { status: 404 });

    const buff = await sharp(data.data as Buffer).jpeg({ quality }).toBuffer()
    return new Response(buff, { status: 200 });
} 