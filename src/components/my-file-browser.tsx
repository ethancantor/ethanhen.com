
'use client';
import { Node } from 'file-paths-to-tree';
import React, { useState } from 'react'
import {motion} from 'framer-motion';

export const FileBrowser = ({ files, onClick }: { files: Node[], onClick?: (file: Node) => void}) => {
    return (
        <div className='outline outline-white'>
            { files.map((file, index) => <FileRow key={index} file={file} onClick={onClick} />) }
        </div>
    )
};


const FileRow = ({ file, onClick, level = 0 }: { file: Node, onClick?: (file: Node) => void, level?: number}) => {

    const children = file.children || [];
    const [open, setOpen] = useState(false);

    const toggleExpand = () => {
        setOpen(!open);
    };

    return (
        <div style={{ marginLeft: `${level * 20}px`}} className='gap-1 flex flex-col'>
            <button className="w-fit bg-zinc-400 text-start outline outline-red-500" onClick={toggleExpand}>
                {file.name}
            </button>
            <motion.div initial={'closed'} className='flex flex-col overflow-hidden gap-1' animate={open ? 'open' : 'closed'} variants={{ closed: { height: 0 }, open: { height: 'auto' } }}>
                {children.map((child, index) => <FileRow key={index} file={child} onClick={onClick} level={level + 1} />)}
            </motion.div>
        </div>
    )
}

