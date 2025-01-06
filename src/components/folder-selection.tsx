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
import { Node } from 'file-paths-to-tree'


export default function FolderSelection({ folderState, initFolders }: { folderState: [string, Dispatch<SetStateAction<string>>], initFolders: Node[] }) {
  
  const [folders, setFolders] = useState<Node[]>(initFolders)
  const [, setSelectedFolder] = folderState
  const [selectedFolderID, setSelectedFolderID] = useState<string | null>(null)
  const [newFolderName, setNewFolderName] = useState('')
  const [parentFolder, setParentFolder] = useState<Node | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: Node = {
        name: newFolderName.trim(),
        path: `${parentFolder?.path || 'root'}/${newFolderName.trim()}`,
        children: [],
        parent: parentFolder
      }

      setFolders((prevFolders) => {
        if (parentFolder === null || parentFolder.path === 'root') {
          return [...prevFolders, newFolder]
        }

        const updateFolders = (folders: Node[]): Node[] => {
          return folders.map((folder) => {
            if (folder === parentFolder) {
              const newFolder: Node = {
                name: newFolderName.trim(),
                path: `${parentFolder?.path || 'root'}/${newFolderName.trim()}`,
                children: [],
                parent: parentFolder
              }
              return {
                ...folder,
                children: [...(folder.children || []), newFolder]
              }
            }
            if (folder.children) {
              return {
                ...folder,
                children: updateFolders(folder.children),
              }
            }
            return folder
          })
        }

        return updateFolders(prevFolders)
      })

      setNewFolderName('')
      setParentFolder(null)
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

  const renderFolder = (folder: Node, depth = 0) => {
    const isExpanded = expandedFolders.has(folder.path)
    const hasSubfolders = folder.children && folder.children.length > 0

    return (
      <div key={folder.path} className={cn("space-y-1", depth > 0 && "ml-4")}>
        <div className="flex items-center space-x-2">
          {hasSubfolders && (
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-6 w-6"
              onClick={() => toggleFolder(folder.path)}
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
          <RadioGroupItem value={folder.path} id={folder.path} />
          <Label
            htmlFor={folder.path}
            className="flex items-center cursor-pointer text-sm"
          >
            <Folder className="mr-2 h-4 w-4" />
            {folder.name}
          </Label>
        </div>
        {isExpanded && hasSubfolders && (
          <div className="mt-1">
            {folder.children!.filter(child => child.children.length > 0).map((children) =>
              renderFolder(children, depth + 1)
            )}
          </div>
        )}
      </div>
    )
  }

  const flattenFolders = (folders: Node[]): Node[] => {
    return folders.reduce((acc, folder) => {
      const shouldContinue = !folder.path.split('/')[folder.path.split('/').length - 1].includes('.') || folder.path === '.'
      if (folder.children && shouldContinue) {
        acc.push(folder)
        acc.push(...flattenFolders(folder.children))
      }
      return acc
    }, [] as Node[])
  }

  const setFolder = (folderId: string) => {
    let foundFolder = null;
    let folderLayer = folders;
    while(!foundFolder && folderLayer.length > 0) {
      foundFolder = folderLayer.find((folder) => folder.path === folderId);
      folderLayer = folderLayer.flatMap((folder) => folder.children || []);
    }

    setSelectedFolder(foundFolder ? `${foundFolder.parent?.path}/${foundFolder.name}` : '');
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
                value={parentFolder?.path || 'root'} 
                onValueChange={(value) => setParentFolder(value === 'root' ? null : flattenFolders(folders).find((folder) => folder.path === value) || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a parent folder" />
                </SelectTrigger>
                <SelectContent>
                  {flattenFolders(folders).map((folder) => (
                    <SelectItem key={folder.path} value={folder.path}>
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

