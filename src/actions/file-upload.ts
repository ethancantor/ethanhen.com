'use server';

import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { join } from "path";

export async function uploadFiles(formData: FormData){

    const files = formData.getAll('file') as File[];
    const folder = formData.get('folder') as string;

    for(const file of files){
        if(!file) continue;
        if(!file.type.includes('image')) continue;

        const bytes= await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const folderPath = join(process.cwd(), `/public/images/${folder}`);
        if(!existsSync(folderPath)) await mkdir(folderPath);

        const path = join(process.cwd(), `/public/images/${folder}`, file.name);
        await writeFile(path, buffer);
    }

    revalidatePath('/gallery');

    return { success: true }
}