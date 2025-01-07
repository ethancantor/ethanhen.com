
'use client';
import { Node } from 'file-paths-to-tree';
import { motion } from 'framer-motion';
import { ChevronDown, DownloadIcon, FileAudio, FileCode, FileCog, FileIcon, FileImage, FileText, FileType, FileVideo, Folder as FolderIcon } from 'lucide-react';
import { useState } from 'react';
import useSWR from 'swr';

export const FileBrowser = ({ nodes }: { nodes: Node[] }) => {
    
    return (
        <div className='px-1 sm:px-8 md:px-16 lg:px-24 flex flex-col'>
            { nodes.map((node, index) => <NodeRow key={index} node={node} />) }
        </div>
    )
};


const NodeRow = ({ node, level = 0 }: { node: Node, level?: number}) => {

    const isFolder = node.name.split('.').slice(-1)[0] === node.name;

    return (
        <div className='gap-1 flex flex-col'>
            { isFolder ? <Folder node={node} level={level} /> : 
            <File node={node} /> }
        </div>
    )
}

const Folder = ({ node, level = 0 } : { node: Node, level: number }) => {

    const [open, setOpen] = useState(false);

    const toggleExpand = () => {
        setOpen(!open);
    };

    return (
        <>
            <button className="w-fit text-start grid grid-cols-4 items-center" onClick={toggleExpand}>
                <FolderIcon />
                <span>{node.name}</span>
                <span>-</span>
                <ChevronDown className={`w-4 h-4 ${open && 'rotate-180' } transition-all duration-300`} /> 
            </button>
            <motion.div initial={'closed'} className='flex flex-col overflow-hidden gap-1' animate={open ? 'open' : 'closed'} variants={{ closed: { height: 0 }, open: { height: 'auto' } }} >
                {node.children && node.children.map((child, index) => <NodeRow key={index} node={child} level={level + 1} />)}
            </motion.div>
        </>
    )
}

const File = ({ node } : { node: Node }) => {
    const { data, error, isLoading } = useSWR(`/api/file-data?path=${node.path}`, (url) => fetch(url).then((res) => res.json()));

    async function downloadClick() {
        const response = await fetch(`/api/files?path=${node.path}`);
        if(!response.ok) return  
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = node.name;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    if(isLoading || error) return <div>Loading...</div>
    return (
        <button className='w-fit text-start grid grid-cols-4 gap-1 items-center'>
            { getFileIcon(node.name) }
            <span> { node.name } </span>
            <span> { FileSizeToReadableStr(data.size) } </span>
            <button onClick={downloadClick}>
                <DownloadIcon  />
            </button>
        </button>
    )
}


function FileSizeToReadableStr(size: number) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let unitIndex = 0;
    while (size >= 1024) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
}

function getFileIcon(fileName: string){
    const fileEnd = fileName.split(".").pop();
    if(fileEnd === 'txt') return <FileText className="text-white-500 h-5 w-5" />;
    else if(fileEnd === 'wav' || fileEnd === 'mp3') return <FileAudio className="text-white-500 h-5 w-5" />
    else if(fileEnd === 'mov' || fileEnd === 'mp4') return <FileVideo className="text-white-500 h-5 w-5" />
    else if(fileEnd === 'pdf') return <FileType className="text-white-500 h-5 w-5" />
    else if(fileEnd === 'png' || fileEnd === 'jpg' || fileEnd === 'jpeg' || fileEnd === 'svg') return <FileImage className="text-white-500 h-5 w-5" />
    else if(fileEnd === 'cfg') return <FileCog className="text-white-500 h-5 w-5" />
    else if(fileEnd === 'sh') return <FileCode className="text-white-500 h-5 w-5" />
    else return <FileIcon className="text-white-500 h-5 w-5" />
}