"use client";

import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, File, X, LoaderIcon } from "lucide-react";
import FolderSelection from "./folder-selection";

interface FolderType {
    id: string
    name: string
    subfolders?: FolderType[]
	parentPath?: string
}


export function FileUploadComponent({ folders }: { folders: FolderType[] }) {
	const [files, setFiles] = useState<File[]>([]);
	const [dragActive, setDragActive] = useState(false);
	const [folder, setFolder] = useState("");
	const [uploading, setUploading] = useState(false);

	const onDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
		setDragActive(true);
	}, []);

	const onDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
	}, []);

	const onDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
		setFiles((prevFiles) => [
			...prevFiles,
			...Array.from(e.dataTransfer.files),
		]);
		}
	}, []);

	const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
		setFiles((prevFiles) => [
			...prevFiles,
			...Array.from(e.target.files as FileList),
		]);
		}
	}, []);

	const removeFile = useCallback((fileToRemove: File) => {
		setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
	}, []);

	const handleUpload = useCallback(async () => {
		setUploading(true);

		const CHUNKSIZE = 1024 * 1024; // 1MB
		for(const file of files){
			let start = 0;
			let currentChunk = 1;
			const totalChunks = Math.ceil(file.size / CHUNKSIZE);
			while(start < file.size){
				const chunk = file.slice(start, start + CHUNKSIZE);
				start += CHUNKSIZE;
				sendChunk(chunk, file.name, currentChunk, totalChunks);
				currentChunk++;
			}

		}

		function sendChunk(chunk: Blob, fileName: string, currentChunk: number, totalChunks: number) {
			const formData = new FormData();
			formData.append("name", fileName);
			formData.append("folder", `${folder}`);
			formData.append("file", chunk);
			formData.append('totalChunk', totalChunks.toString());
			formData.append('currentChunk', currentChunk.toString());
			fetch("/api/upload", { method: "POST", body: formData, });
		}
		// setFiles([]);
		setUploading(false);

	}, [files, folder]);

	return (
		<div className="w-full max-w-md mx-auto bg-zinc-800 rounded-2xl px-5 pt-5 pb-3 flex flex-col gap-2">
			<div
				className={`relative p-4 rounded-2xl ${
				dragActive ? "bg-green-700" : "bg-zinc-800"
				} transition-colors duration-300 ease-in-out`}
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onDrop={onDrop}
			>
				<Input
					type="file"
					multiple
					onChange={onFileSelect}
					className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					aria-label="File upload"
				/>
				<div className="text-center">
					{uploading ? (
						<LoaderIcon className="mx-auto h-12 w-12 text-white animate-spin animate-infinite" />
					) : (
						<Upload className="mx-auto h-12 w-12 text-white" />
					)}
				<p className="mt-2 text-sm text-white">
					Drag and drop files here, or click to select files
				</p>
			</div>
			</div>
			<div className="max-h-[75vh] overflow-y-auto">
				{files.length > 0 && (
					<div className="mt-4">
						<h3 className="text-lg font-semibold mb-2">Selected Files:</h3>
						<ul className="space-y-2">
							{files.map((file, index) => (
							<li
								key={index}
								className="flex items-center justify-between bg-zinc-900 p-2 rounded-2xl"
							>
								<div className="flex items-center">
								<File className="h-5 w-5 mr-2 text-zinc-500" />
								<span className="text-sm truncate">{file.name}</span>
								</div>
								<Button
								variant="ghost"
								size="icon"
								onClick={() => removeFile(file)}
								aria-label={`Remove ${file.name}`}
								>
								<X className="h-4 w-4" />
								</Button>
							</li>
							))}
						</ul>
					</div>
				)}
			</div>
			<div className="w-full flex flex-col justify-center items-center gap-2">
				<Button
				variant={"ghost"}
					className="w-full hover:bg-green-800"
					onClick={() => handleUpload()}
					disabled={uploading || files.length === 0}
				>
					Submit
				</Button>
				<FolderSelection folderState={[folder, setFolder]} initFolders={folders} />
			</div>
		</div>
	);
}
