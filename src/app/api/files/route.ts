import { DB_FILE } from "@/types/db_types";
import { authOptions } from "@/utils/authOptions";
import { db } from "@/utils/sqlite";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {


    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    const data = db.prepare("SELECT * FROM files WHERE path = ?").get(path) as DB_FILE | null | undefined;

    if(!data || !path) return new Response('Not Found', { status: 404 });
    
    const session = await getServerSession(authOptions);
    const is_private = data.is_private;
    if(!session && is_private) return new Response('Unauthorized', { status: 401 });

    // Define a mapping of file extensions to content types
    const contentTypeMap = {
        svg: "image/svg+xml",
        ico: "image/x-icon",
        png: "image/png",
        jpg: "image/jpeg",
        pdf: "application/pdf",
    };

    // Get the file extension
    const fileExtension = path.split(".").pop()?.toLowerCase() as keyof typeof contentTypeMap;

    const fileName = path.split('/').pop() || '';

    // Determine the content type based on the file extension
    const contentType = contentTypeMap[fileExtension] || "application/octet-stream";

    return new Response(data.data as Buffer, { headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`
    }});
}
