
import { DB_FILE } from "@/types/db_types";
import { db } from "@/utils/sqlite";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest){
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    const data = db.prepare("SELECT * FROM files WHERE path = ?").get('./' + path) as DB_FILE | null | undefined;

    const ret_data = {
        size: 0
    }


    if(!data) return Response.json(ret_data, { status: 404 });

    const b = Buffer.from(data.data as Buffer);
    ret_data.size = b.byteLength;

    return Response.json(ret_data, { status: 200 });
} 