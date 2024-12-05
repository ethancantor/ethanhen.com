'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { ChevronRight, Folder, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface FolderType {
  id: string
  name: string
  subfolders?: FolderType[]
  parentPath?: string
}

export default function FolderSelection({ folderState, initFolders }: { folderState: [string, Dispatch<SetStateAction<string>>], initFolders: FolderType[] }) {
  
  const [folders, setFolders] = useState<FolderType[]>(initFolders)
  const [, setSelectedFolder] = folderState
  const [selectedFolderID, setSelectedFolderID] = useState<string | null>(null)
  const [newFolderName, setNewFolderName] = useState('')
  const [parentFolderId, setParentFolderId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: FolderType = {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        parentPath: `./files/gallery`
      }

      setFolders((prevFolders) => {
        if (parentFolderId === null || parentFolderId === 'root') {
          return [...prevFolders, newFolder]
        }

        const updateFolders = (folders: FolderType[]): FolderType[] => {
          return folders.map((folder) => {
            if (folder.id === parentFolderId) {
              const newFolder: FolderType = {
                id: Date.now().toString(),
                name: newFolderName.trim(),
                parentPath: `${folder.parentPath}/${folder.name}`
              }
              return {
                ...folder,
                subfolders: [...(folder.subfolders || []), newFolder]
              }
            }
            if (folder.subfolders) {
              return {
                ...folder,
                subfolders: updateFolders(folder.subfolders),
              }
            }
            return folder
          })
        }

        console.log(prevFolders);

        return updateFolders(prevFolders)
      })

      setNewFolderName('')
      setParentFolderId(null)
      setIsDialogOpen(false)
    }
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(folderId)) {
        newSet.delete(folderId)
      } else {
        newSet.add(folderId)
      }
      return newSet
    })
  }

  const renderFolder = (folder: FolderType, depth = 0) => {
    const isExpanded = expandedFolders.has(folder.id)
    const hasSubfolders = folder.subfolders && folder.subfolders.length > 0

    return (
      <div key={folder.id} className={cn("space-y-1", depth > 0 && "ml-4")}>
        <div className="flex items-center space-x-2">
          {hasSubfolders && (
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-6 w-6"
              onClick={() => toggleFolder(folder.id)}
            >
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded && "transform rotate-90"
                )}
              />
            </Button>
          )}
          {!hasSubfolders && <div className="w-6" />}
          <RadioGroupItem value={folder.id} id={folder.id} />
          <Label
            htmlFor={folder.id}
            className="flex items-center cursor-pointer text-sm"
          >
            <Folder className="mr-2 h-4 w-4" />
            {folder.name}
          </Label>
        </div>
        {isExpanded && hasSubfolders && (
          <div className="mt-1">
            {folder.subfolders!.map((subfolder) =>
              renderFolder(subfolder, depth + 1)
            )}
          </div>
        )}
      </div>
    )
  }

  const flattenFolders = (folders: FolderType[]): FolderType[] => {
    return folders.reduce((acc, folder) => {
      acc.push(folder)
      if (folder.subfolders) {
        acc.push(...flattenFolders(folder.subfolders))
      }
      return acc
    }, [] as FolderType[])
  }

  const setFolder = (folderId: string) => {
    let foundFolder = null;
    let folderLayer = folders;
    while(!foundFolder && folderLayer.length > 0) {
      foundFolder = folderLayer.find((folder) => folder.id === folderId);
      folderLayer = folderLayer.flatMap((folder) => folder.subfolders || []);
    }

    setSelectedFolder(foundFolder ? `${foundFolder.parentPath}/${foundFolder.name}` : '');
    setSelectedFolderID(folderId);
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <RadioGroup value={selectedFolderID || ''} onValueChange={setFolder} className='bg-zinc-900 rounded-lg px-2 py-1'>
        {folders.map((folder) => renderFolder(folder))}
      </RadioGroup>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="w-full hover:bg-zinc-900">
            <Plus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentFolder">Parent Folder (Optional)</Label>
              <Select 
                value={parentFolderId || 'root'} 
                onValueChange={(value) => setParentFolderId(value === 'root' ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a parent folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">Root</SelectItem>
                  {flattenFolders(folders).map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreateFolder} className="w-full">Create Folder</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

