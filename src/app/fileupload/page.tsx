import { FileUploadComponent } from "@/components/file-upload"
import path from "path";
import React from "react"
import fs from 'fs';

async function getGalleryFolders () {
    const imageDir = path.join(process.cwd(), "/public/images");
	const folders = fs.readdirSync(imageDir);

    return { folders };
}

export default async function FileUpload() {

    const { folders } = await getGalleryFolders();

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <FileUploadComponent folders={folders}/>
        </div>
    )
};
