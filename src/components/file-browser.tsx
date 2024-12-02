"use client";

import { useState } from "react";
import { FileIcon, FolderIcon, ChevronDown, ChevronUp, FileText, FileAudio, FileVideo, FileType, FileImage, FileCog, FileCode, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { File } from "@/app/files/page";
import { Dialog, DialogContent, DialogTitle } from "./dialog";

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
	const [showEdit, setShowEdit] = useState(false);
	const fullPath = `${path}${file.name}`;

	const [currentName, setCurrentName] = useState(file.name);

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	let icon = <FolderIcon className="text-yellow-500 h-5 w-5" />;
	if(file.type === "file") {
		const fileEnd = file.name.split(".").pop();
		if(fileEnd === 'txt') icon = <FileText className="text-white-500 h-5 w-5" />;
		else if(fileEnd === 'wav' || fileEnd === 'mp3') icon = <FileAudio className="text-white-500 h-5 w-5" />
		else if(fileEnd === 'mov' || fileEnd === 'mp4') icon = <FileVideo className="text-white-500 h-5 w-5" />
		else if(fileEnd === 'pdf') icon = <FileType className="text-white-500 h-5 w-5" />
		else if(fileEnd === 'png' || fileEnd === 'jpg' || fileEnd === 'jpeg' || fileEnd === 'svg') icon = <FileImage className="text-white-500 h-5 w-5" />
		else if(fileEnd === 'cfg') icon = <FileCog className="text-white-500 h-5 w-5" />
		else if(fileEnd === 'sh') icon = <FileCode className="text-white-500 h-5 w-5" />
		else icon = <FileIcon className="text-white-500 h-5 w-5" />
	}

	return (
		<div>
			<div className={`flex items-center space-x-2 ${(file.type === 'folder' && (file.children && file.children.length > 0)) && 'cursor-pointer'}`} >
				{icon}
				<span className={file.type === "folder" ? "font-semibold" : ""} onClick={file.type === "folder" ? toggleExpand : undefined}>{currentName}</span>
				{file.type === "folder" && (file.children && file.children.length > 0) && (
				<Button
					size="sm"
					variant="ghost"
					className="p-0 h-6 w-6"
					onClick={file.type === "folder" ? toggleExpand : undefined}
				>
					{isExpanded ? (
						<ChevronDown className="h-4 w-4" />
					) : (
						<ChevronUp className="h-4 w-4" />
					)}
				</Button>
				)}
				<Button size="sm" variant="ghost" onClick={() => setShowEdit(true)}>
					<Edit className="h-4 w-4"/>
				</Button>
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
			<Dialog open={showEdit} onOpenChange={setShowEdit}>
				<DialogContent>
					<DialogTitle>Edit File</DialogTitle>
					<input value={currentName} onChange={(e) => setCurrentName(e.target.value)}/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
