import { db } from "@/utils/sqlite";

export async function GET(){
    const data = db.prepare("SELECT path FROM files where is_gallery_image='true'").all() as { name: string, folder: string }[];
    return new Response(JSON.stringify(data), { status: 200 });
}