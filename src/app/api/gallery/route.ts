import { db } from "@/utils/sqlite";

export async function GET(){
    const data = db.prepare('SELECT name, folder FROM images').all() as { name: string, folder: string }[];
    return new Response(JSON.stringify(data), { status: 200 });
}