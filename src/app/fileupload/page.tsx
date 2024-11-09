import { FileUploadComponent } from "@/components/file-upload"
import path from "path";
import React from "react"
import fs from 'fs';
import { authOptions } from "@/utils/authOptions";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

async function getGalleryFolders () {
    const imageDir = path.join(process.cwd(), "/data/gallery");
	const folders = fs.readdirSync(imageDir);

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
