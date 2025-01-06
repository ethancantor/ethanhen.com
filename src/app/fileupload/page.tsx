import { FileBrowser } from "@/components/my-file-browser";
import { authOptions } from "@/utils/authOptions";
import { db } from "@/utils/sqlite";
import { filePathsToTree } from "file-paths-to-tree";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";


export default async function FileUpload() {

    const session = await getServerSession(authOptions);
    if(!session) redirect('/api/auth/signin')

    const paths = db.prepare("select path from files").all() as { path: string }[];
    const str_folders = paths.map((file: { path: string }) => file.path)

    const folders = filePathsToTree(str_folders);
    
    return (
        <div className="w-screen h-screen py-20 overflow-x-hidden">
            <FileBrowser files={folders}/>
        </div>
    )
};
