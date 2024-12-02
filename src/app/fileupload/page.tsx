import { FileUploadComponent } from "@/components/file-upload"
import path from "path";
import React from "react"
import { readdirSync, statSync } from 'fs';
import { authOptions } from "@/utils/authOptions";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";

async function getGalleryFolders () {
    const imageDir = path.join(process.cwd(), "/files");
	// const folders = fs.readdirSync(imageDir);

    function recurReadDir(directory: string) {
        try {
            const folders: string[] = [];
            const files: string[] = readdirSync(directory);
            const isFolder = statSync(directory).isDirectory();
            if(!isFolder) return [];
            folders.push(directory);
            for(const folder of files){
                const absolute = path.join(directory, folder);
                folders.push(...recurReadDir(absolute));
            }
            return folders;
        } catch(err){
            return [];
        }
    }

    const folders = recurReadDir(imageDir).map(s => s.replace(imageDir, ''));

    return { folders };
}

export default async function FileUpload() {

    const { folders } = await getGalleryFolders();

    const session = await getServerSession(authOptions);
    if(!session) redirect('/api/auth/signin')

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <FileUploadComponent folders={folders}/>
        </div>
    )
};
