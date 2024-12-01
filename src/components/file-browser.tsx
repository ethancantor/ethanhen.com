"use client";

import { useState } from "react";
import { FileIcon, FolderIcon, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { File } from "@/app/files/page";

interface FileBrowserProps {
	files: File[];
}

export default function FileBrowser({ files }: FileBrowserProps) {
	return (
		<div className="space-y-2">
		{files.map((file, index) => (
			<FileItem key={index} file={file} level={0} />
		))}
		</div>
	);
}	

interface FileItemProps {
	file: File;
	level: number;
	path?: string;
}

function FileItem({ file, level, path = "" }: FileItemProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const fullPath = `${path}${file.name}`;

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<div>
		<div className="flex items-center space-x-2">
			{file.type === "folder" && (
			<Button
				variant="ghost"
				size="sm"
				className="p-0 h-6 w-6"
				onClick={toggleExpand}
			>
				{isExpanded ? (
					<ChevronDown className="h-4 w-4" />
				) : (
					<ChevronRight className="h-4 w-4" />
				)}
			</Button>
			)}
			{file.type === "folder" ? (
					<FolderIcon className="text-yellow-500 h-5 w-5" />
				) : (
					<FileIcon className="text-gray-500 h-5 w-5" />
				)
			}
			<span className={file.type === "folder" ? "font-semibold" : ""}>{file.name}</span>
			{/* {file.type === "file" && <DownloadButton fileName={fullPath} />} */}
		</div>
		{file.type === "folder" && isExpanded && (
			<div className="ml-6 mt-2 space-y-2">
			{file.children?.map((childFile, index) => (
				<FileItem
				key={index}
				file={childFile}
				level={level + 1}
				path={`${fullPath}/`}
				/>
			))}
			</div>
		)}
		</div>
	);
}
