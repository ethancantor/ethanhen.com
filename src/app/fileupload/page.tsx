import { FileUploadComponent } from "@/components/file-upload";
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
    const node_strs = paths.map((file: { path: string }) => file.path.split('./').slice(1).join('.'));

    const nodes = filePathsToTree(node_strs);
    
    return (
        <div className="w-screen h-screen py-20 overflow-x-hidden">
            <FileUploadComponent folders={nodes} />
        </div>
    )
};
