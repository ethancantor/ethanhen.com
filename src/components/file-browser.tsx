"use client";

import { useState } from "react";
import { FileIcon, FolderIcon, ChevronDown, ChevronUp, FileText, FileAudio, FileVideo, FileType, FileImage, FileCog, FileCode, Edit, FileX, FolderX, ShieldQuestionIcon, LoaderIcon, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./dialog";
import { createSubFolder, deleteFile, deleteFolder, renamePath } from "@/actions/file-editing";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function FileBrowser({ files }: { files: string[]}) {
	return (
		<div className="space-y-2">
			{files.map((file, index) => (
				<div key={index}>{file}</div>
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
	const [showAddFolder, setShowAddFolder] = useState(false);

	const fullPath = `${path}${file.name}`;
	const [editPath, setEditPath] = useState(fullPath);
	const [deleteState, setDeleteState] = useState('');

	const [downloadState, setDownloadState] = useState('');
	
	const router = useRouter();
	const { data: session } = useSession();


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

	const handleDelete = async () => {
		if(deleteState === '') {
			setDeleteState('confirm');
			setTimeout(() => setDeleteState(''), 2000);
		} else {
			setDeleteState('deleting');
			if(file.type === 'folder') await deleteFolder(fullPath);
			else await deleteFile(fullPath);
			router.refresh();
			setDeleteState('');
			setShowEdit(false);
		}
	}

	const handleEditSubmit = async () => {
		const hasChanged = editPath !== fullPath;
		if(hasChanged){
			await renamePath(fullPath, editPath);
			router.refresh();
			setShowEdit(false);
		}
	}

	let deleteIcon = file.type === "file" ? <FileX className="h-4 w-4 text-red-500"/> : <FolderX className="h-4 w-4 text-red-500"/>
	if(deleteState === 'deleting') deleteIcon = <LoaderIcon className="h-4 w-4 text-green-500 animate-spin"/>
	else if(deleteState === 'confirm') deleteIcon = <ShieldQuestionIcon className="h-4 w-4 text-yellow-500"/>

	let downloadIcon = <Download className="h-4 w-4 text-white-500"/>
	if(downloadState === 'downloading') downloadIcon = <LoaderIcon className="h-4 w-4 text-green-500 animate-spin"/>
	else if(downloadState === 'confirm') downloadIcon = <ShieldQuestionIcon className="h-4 w-4 text-yellow-500"/>

	const handleDownload = async () => {
		if(downloadState === '') {
			setDownloadState('confirm');
			setTimeout(() => setDownloadState(''), 2000);
		} else {
			setDownloadState('downloadng');
			try {
				const response = await fetch(`/api/upload?path=${fullPath}`);
				if(response.status !== 200) return;
				const blob = await response.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = file.name;
				a.click();
				URL.revokeObjectURL(url);
			} catch(err){}
			setDownloadState('');
		}
	}

	const sizeConverter = (bytes: number) => {
		const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log2(bytes) / 10);
		return `${(bytes / 2 ** (i * 10)).toFixed(2)} ${sizes[i]}`;
	}

	return (
		<div>
			<div className={`flex items-center justify-between ${level % 2 === 0 ? 'bg-zinc-800' : 'bg-zinc-700'} px-2 py-1 rounded-lg ${(file.type === 'folder' && (file.children && file.children.length > 0)) && 'cursor-pointer'}`} >
				<div className="flex flex-row items-center space-x-2">
					{icon}
					<span className={file.type === "folder" ? "font-semibold" : ""} onClick={file.type === "folder" ? toggleExpand : undefined}>{file.name}</span>
					<span className="text-sm">{new Date(file.stats.ctime).toLocaleDateString()}</span>
					<span className="text-sm">{file.type === 'folder' ? '-' : sizeConverter(file.stats.size)}</span>
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
					{file.type === 'folder' && Boolean(session) && (
						<Button
							onClick={() => setShowAddFolder(true)}
							size="sm"
							variant="ghost"
							className="h-6 w-6"
						>
							<Plus className="h-4 w-4" />
						</Button>
					)}
					<AddFolderDialog path={fullPath} showState={[showAddFolder, setShowAddFolder]} />
				</div>
				<div className="flex flex-row gap-1">
					{ file.type === "file" && <Button size="sm" variant="ghost" onClick={handleDownload} 
							className="h-6 w-6 p-1">
						{downloadIcon}
					</Button>}
					{ Boolean(session) && <Button size="sm" variant="ghost" onClick={() => setShowEdit(true)} 
							className="h-6 w-6 p-1">
						<Edit className="h-4 w-4"/>
					</Button> }
				</div>
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
				<DialogContent className="bg-zinc-900">
					<DialogTitle>Edit File</DialogTitle>
					<input value={editPath} onChange={(e) => setEditPath(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white focus:ring-zinc-600 focus:border-zinc-600 px-2 py-2 rounded-lg"/>
					<DialogFooter className="flex flex-row justify-end gap-1 items-center">
						<Button size="sm" variant="ghost" onClick={handleDelete}> Delete { deleteIcon } </Button>
						<Button className="text-red-500" variant="ghost" onClick={() => setShowEdit(false)}>Cancel</Button>
						<Button className="text-green-500" variant="ghost" onClick={() => handleEditSubmit()}>Save</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

function AddFolderDialog({ path, showState }: { path: string, showState: [boolean, React.Dispatch<React.SetStateAction<boolean>>] }) {

	const router = useRouter();
	const [folderName, setFolderName] = useState('');
	const [show, setShow] = showState;

	const handleCreateFolder = async () => {
		const response = await createSubFolder(path, folderName);
		if(response.status === 200) {
			setShow(false);
			router.refresh();
		}
	}

	return (
		<Dialog open={show} onOpenChange={setShow}>
			<DialogContent className="bg-zinc-900">
				<DialogTitle>Create Folder</DialogTitle>
				<input value={folderName} onChange={(e) => setFolderName(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white focus:ring-zinc-600 focus:border-zinc-600 px-2 py-2 rounded-lg"/>
				<DialogFooter className="flex flex-row justify-end gap-1 items-center">
					<Button size="sm" variant="ghost" onClick={() => setShow(false)}>Cancel</Button>
					<Button className="text-green-500" variant="ghost" onClick={() => handleCreateFolder()}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)

}
