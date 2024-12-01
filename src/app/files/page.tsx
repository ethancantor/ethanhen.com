import FileBrowser from "@/components/file-browser"
import { readdirSync, statSync } from "fs";
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
            return files.push({name: absolute, type: 'folder', children: subFiles});
        } else {
            return files.push({name: file, type: 'file', children: subFiles});

        }
    });

    return files;
}

export default async function FilesPage() {

    const files = recurDir("./files");
    console.log(files);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">File Browser</h1>
            <FileBrowser files={files} />
        </div>
    )
};
