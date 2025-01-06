
export type File = {
    path: string;
    type: 'file' | 'image'
    data: unknown;
}

export type Folder = {
    path: string;
    parent?: Folder;
    children?: Folder[];
}