"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { File, Folder, LoaderIcon, Upload, X } from "lucide-react";
import React, { useCallback, useState } from "react";

interface FileWithPath extends File {
	path?: string
}


export function FileUploadComponent() {
	const [files, setFiles] = useState<FileWithPath[]>([]);
	const [dragActive, setDragActive] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [wasError, setWasError] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);

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

	const processEntry = useCallback(async (entry: FileSystemEntry, path = '', idx: number = 0): Promise<FileWithPath[]> => {
		return new Promise((resolve) => {
			if (entry.isFile) {
				(entry as FileSystemFileEntry).file((file: File) => {
					const fileWithPath = Object.assign(file, { path })
					resolve([fileWithPath])
				})
			} else if (entry.isDirectory) {
				const dirReader = (entry as FileSystemDirectoryEntry).createReader()
				dirReader.readEntries(async (entries) => {
					const filesInDir = await Promise.all( entries.map((e) => processEntry(e, `${path}/${entry.name}`, idx)) )
					resolve(filesInDir.flat())
				})
			} else resolve([])
		})
	}, []);

	const onDrop = useCallback(async (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		
		const items = e.dataTransfer.items;
		const promiseList: Promise<FileWithPath[]>[] = [];

		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if(item.kind === 'file'){
				const entry = item.webkitGetAsEntry();
				if (entry) {
					const foundFiles = processEntry(entry, '', i);
					promiseList.push(foundFiles);
				} 
			}
		}

		const allFiles = await Promise.all(promiseList);
		setFiles((prev) => [...prev, ...allFiles.flat()]);
	}, [processEntry]);

	const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const filesWithPath = Array.from(e.target.files).map((file) => Object.assign(file, { path: '' }))
			setFiles((prevFiles) => [
				...prevFiles,
				...filesWithPath,
			]);
		}
	}, []);

	const removeFile = useCallback((fileToRemove: File) => {
		setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
	}, []);

	const handleUpload = useCallback(async () => {
		setUploadProgress(0);
		setUploading(true);

		const total_file_size = files.reduce((acc, file) => acc + file.size, 0);

		console.log(total_file_size);

		const CHUNKSIZE = 1024 * 1024; // 1MB
		const NUMRETIRES = 3;

		const erroredFiles = [];
		for(const file of files){
			let numErrors = 0;
			let wasError = true;
			while(wasError && numErrors < NUMRETIRES){
				wasError = await sendFile(file);
				if(wasError) numErrors++;
			}
			if(wasError) erroredFiles.push(file);
		}

		async function sendFile(file: FileWithPath) {
			let start = 0;
			let currentChunk = 1;
			const totalChunks = Math.ceil(file.size / CHUNKSIZE);
			const responseList = [];
			while(start < file.size){
				const chunk = file.slice(start, start + CHUNKSIZE);
				start += CHUNKSIZE;
				const response = await sendChunk(chunk, `${file.path || ''}/${file.name}`, currentChunk, totalChunks);
				if(response.ok) setUploadProgress((prev) => prev + (CHUNKSIZE / total_file_size) * 100);
				responseList.push(response);
				currentChunk++;
			}

			const wasError = responseList.some(response => !response.ok) || responseList.length !== totalChunks;
			return wasError;
		}

		async function sendChunk(chunk: Blob, path: string, currentChunk: number, totalChunks: number,) {
			const formData = new FormData();
			formData.append("name", path);
			formData.append("file", chunk);
			formData.append('totalChunk', totalChunks.toString());
			formData.append('currentChunk', currentChunk.toString());
			const response = await fetch("/api/upload", { method: "POST", body: formData, });
			return response;
		}
		setWasError(erroredFiles.length > 0);
		setFiles(erroredFiles);
		setUploading(false);

	}, [files]);

	const fileGroups: string[] = files.reduce((acc: string[], file: FileWithPath) => {
		const path = file.path || '';
		if(!acc.includes(path)) acc.push(path);
		return acc;
	}, []);

	return (
		<div className="w-full max-w-md mx-auto rounded-2xl px-5 pt-5 pb-3 flex flex-col gap-2">
			<div
				className={`relative p-4 rounded-2xl ${
				dragActive ? "bg-green-700" : ""
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
					{ uploading && <p className="mt-2 text-sm text-white">{uploadProgress.toFixed(2)}%</p> }
				<p className="mt-2 text-sm text-white">
					Drag and drop files here, or click to select files
				</p>
				{ wasError && <p className="mt-2 text-sm text-red-500">
					Looks like some files failed to upload. Please try them again
				</p> }
			</div>
			</div>
			<div className="max-h-[60vh] overflow-y-auto">
				{fileGroups.length > 0 && (
					<div>
						<h3 className="text-lg font-semibold mb-2">Selected Folders:</h3>
						{fileGroups.map((group, index) => (
							<FileGroup key={index} files={files.filter(file => file.path === group)} wasError={wasError} group={group} removeFile={removeFile} />
						))}
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
				{/* <FolderSelection folderState={[folder, setFolder]} initFolders={folders} /> */}
			</div>
		</div>
	);
}


function FileGroup({ files, wasError, group, removeFile }: { files: FileWithPath[], wasError: boolean, group: string, removeFile: (file: FileWithPath) => void }) {

	return (
		<div
			className={`flex items-start flex-col gap-3 bg-zinc-900 p-2 rounded-lg`}
		>
			<div className="flex items-center p-4">
				<Folder className="h-5 w-5 mr-2 text-zinc-500" />
				<span className="text-lg truncate">{group}</span>
			</div>
			<ul className="space-y-2 w-full">
				{files.map((file, index) => (
				<li
					key={index}
					className={`flex items-center justify-between even:bg-zinc-800 odd:bg-zinc-700 w-full p-2 rounded-2xl ${wasError && 'outline outline-1 outline-red-500'}`}
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
	) 
}