"use client"

import React, { useState, useCallback } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload, File, X } from "lucide-react"
import { uploadFiles } from '@/actions/file-upload'
import AutocompleteInput from './autocomplete-input'

export function FileUploadComponent({ folders } : { folders: string[] }) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [folder, setFolder] = useState('');
  
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy"
    setDragActive(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(prevFiles => [...prevFiles, ...Array.from(e.dataTransfer.files)])
    }
  }, [])

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files as FileList)])
    }
  }, [])

  const removeFile = useCallback((fileToRemove: File) => {
    setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove))
  }, [])

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-800 rounded-2xl px-5 pt-5 pb-3 flex flex-col gap-2">
      <div
        className={`relative p-4 border-2 border-dashed rounded-2xl ${
          dragActive ? "border-green-500" : "border-zinc-300"
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
          <Upload className="mx-auto h-12 w-12 text-white" />
          <p className="mt-2 text-sm text-white">
            Drag and drop files here, or click to select files
          </p>
        </div>
      </div>
      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Selected Files:</h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-zinc-900 p-2 rounded-2xl">
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
      <div className='w-full flex flex-row justify-center items-center gap-2'>
        <button className='text-zinc-900 bg-green-500 px-2 py-1 rounded-2xl text-center text-sm'
        
          onClick={() => {
            const formData = new FormData();
            formData.append('folder', folder);
            for(const file of files){
                formData.append('file', file);
            }
            uploadFiles(formData);
          }}
        >Submit</button>
        <AutocompleteInput folders={folders} folderState={[folder, setFolder]}/>
      </div>
    </div>
  )
}