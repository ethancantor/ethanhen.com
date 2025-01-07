import { db, GALLERY_IMAGE } from "@/utils/sqlite";

export async function GET(){
    const data = db.prepare("SELECT * FROM gallery_images").all() as GALLERY_IMAGE[];

    return new Response(JSON.stringify(data.map(d => d.path)), { status: 200 });
}