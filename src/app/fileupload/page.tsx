import { FileUploadComponent } from "@/components/file-upload"
import path from "path";
import React from "react"
import { readdirSync, statSync } from 'fs';
import { authOptions } from "@/utils/authOptions";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

interface FolderType {
    id: string
    name: string
    subfolders?: FolderType[]
    parentPath?: string
}

function getGalleryFolders(directory: string) {
    const folders: FolderType[] = [];
    readdirSync(directory).forEach(file => {
        const subFolders: FolderType[] = [];
        const absolute = path.join(directory, file);
        if (statSync(absolute).isDirectory()) {
            subFolders.push(...getGalleryFolders(absolute));
            return folders.push({name: file, id: randomUUID(), subfolders: subFolders, parentPath: directory});
        } else return []
    });

    return folders;
}

export default async function FileUpload() {

    const folders = getGalleryFolders('./files');

    const session = await getServerSession(authOptions);
    if(!session) redirect('/api/auth/signin')

    return (
        <div className="w-screen h-screen py-20 overflow-x-hidden">
            <FileUploadComponent folders={folders}/>
        </div>
    )
};
