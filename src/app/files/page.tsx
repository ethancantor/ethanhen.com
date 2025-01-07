import FileBrowser from "@/components/file-browser";
import { authOptions } from "@/utils/authOptions";
import { db } from "@/utils/sqlite";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";

export default async function FilesPage() {

    const session = await getServerSession(authOptions);
    const fetch = Boolean(session) ? 'select path from files' : 'select path from files where is_private=\'false\'';
    const files = db.prepare(fetch).all() as { path: string }[];

    return (
        <div className="container mx-auto p-4">
            <FileBrowser files={files.map(f => f.path)} />
        </div>
    )
};
