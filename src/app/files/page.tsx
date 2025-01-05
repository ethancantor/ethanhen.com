import React from "react"
import {db} from "@/utils/sqlite";
import FileBrowser from "@/components/file-browser";

export const dynamic = "force-dynamic";

export default async function FilesPage() {
    const files = db.prepare("select path from files where type='file'").all() as { path: string }[];

    return (
        <div className="container mx-auto p-4">
            <FileBrowser files={files.map(f => f.path)} />
        </div>
    )
};
