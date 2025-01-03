'use server';

import { authOptions } from "@/utils/authOptions";
import { existsSync, mkdirSync, renameSync, rmdirSync, unlinkSync } from "fs";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function deleteFile(path: string) {
    const session = await getServerSession(authOptions);
    if(!session) return { message: 'Unauthorized',  status: 401 };
    
    existsSync(`./files/${path}`) && unlinkSync(`./files/${path}`);
    revalidatePath(`/files`);
    revalidatePath(`/gallery`);
    return { message: 'OK',  status: 200 };
}

export async function deleteFolder(folder: string) {
    const session = await getServerSession(authOptions);
    if(!session) return { message: 'Unauthorized',  status: 401 };
    
    existsSync(`./files/${folder}`) && rmdirSync(`./files/${folder}`, { recursive: true });
    revalidatePath(`/files`);
    revalidatePath(`/gallery`);
    return { message: 'OK',  status: 200 };
}

export async function renamePath(oldPath: string, newPath: string) {
    const session = await getServerSession(authOptions);
    if(!session) return { message: 'Unauthorized',  status: 401 };
    
    try {
        existsSync(`./files/${oldPath}`) && renameSync(`./files/${oldPath}`, `./files/${newPath}`);
        revalidatePath(`/files`);
        revalidatePath(`/gallery`);
        return { message: 'OK',  status: 200 };
    } catch(err){ return { message: 'Error',  status: 500 }; }
}

export async function createSubFolder(path: string, folderName: string) {
    const session = await getServerSession(authOptions);
    if(!session) return { message: 'Unauthorized',  status: 401 };
    
    try {
        if(!existsSync(`./files/${path}`)) return { message: 'Not Found',  status: 404 };
        let fileNumber = 0;
        let fileRepeat = '';
        while(existsSync(`./files/${path}/${folderName}${fileRepeat}`)){
            fileNumber++;
            fileRepeat = `(${fileNumber})`;
        }
        mkdirSync(`./files/${path}/${folderName}${fileRepeat}`);
        revalidatePath(`/files`);
        revalidatePath(`/gallery`);
        return { message: 'OK',  status: 200 };
    } catch(err){ return { message: 'Error',  status: 500 }; }

}