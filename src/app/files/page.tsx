import FileBrowser from "@/components/file-browser"
import { authOptions } from "@/utils/authOptions";
import { readdirSync, statSync } from "fs";
import { getServerSession } from "next-auth";
import path from "path";
import React from "react"

export const dynamic = "force-dynamic";

export interface File {
	name: string;
	type: "file" | "folder";
	children?: File[];
}

function recurDir(directory: string) {
    const files: File[] = [];
    readdirSync(directory).forEach(file => {
        const subFiles: File[] = [];
        const absolute = path.join(directory, file);
        if (statSync(absolute).isDirectory()) {
            subFiles.push(...recurDir(absolute));
            return files.push({name: file, type: 'folder', children: subFiles});
        } else {
            return files.push({name: file, type: 'file', children: subFiles});

        }
    });

    return files;
}

export default async function FilesPage() {
    const files = recurDir("./files");
    const galleryFiles = files.filter(file => file.name === 'gallery');
    const privateFiles = files.filter(file => file.name === 'private');
    const publicFiles = files.filter(file => file.name === 'public');

    const session = await getServerSession(authOptions);

    const sendFiles = [...galleryFiles, ...publicFiles];
    if(session) sendFiles.push(...privateFiles);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">File Browser</h1>
            <FileBrowser files={sendFiles} />
        </div>
    )
};
