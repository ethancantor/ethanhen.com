
'use client';
import { Node } from 'file-paths-to-tree';
import { motion } from 'framer-motion';
import { ChevronDown, FileIcon, Folder as FolderIcon } from 'lucide-react';
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
        <div style={{ marginLeft: `${level * 20}px`}} className='gap-1 flex flex-col'>
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
            <button className="w-fit text-start flex flex-row gap-1 items-center" onClick={toggleExpand}>
                <FolderIcon />
                {node.name}
                <ChevronDown className={`w-4 h-4 ${open && 'rotate-180' } transition-all duration-300`} /> 
            </button>
            <motion.div initial={'closed'} className='flex flex-col overflow-hidden gap-1' animate={open ? 'open' : 'closed'} variants={{ closed: { height: 0 }, open: { height: 'auto' } }}>
                {node.children && node.children.map((child, index) => <NodeRow key={index} node={child} level={level + 1} />)}
            </motion.div>
        </>
    )
}

const File = ({ node } : { node: Node }) => {
    const { data, error, isLoading } = useSWR(`/api/file-data?path=${node.path}`, (url) => fetch(url).then((res) => res.json()));

    if(isLoading || error) return <div>Loading...</div>
    return (
        <button className='w-fit text-start flex flex-row gap-3 items-center'>
            <FileIcon />
            <span> { node.name } </span>
            <span> { FileSizeToReadableStr(data.size) } </span>
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