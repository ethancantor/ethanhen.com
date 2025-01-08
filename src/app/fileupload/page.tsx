import { FileUploadComponent } from "@/components/file-upload";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";


export default async function FileUpload() {

    const session = await getServerSession(authOptions);
    if(!session) redirect('/api/auth/signin')
    
    return (
        <div className="w-screen h-screen py-20 overflow-x-hidden">
            <FileUploadComponent  />
        </div>
    )
};
