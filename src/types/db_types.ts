
export type DB_FILE = {
    path: string;
    data: unknown;
    is_gallery_image: boolean;
    is_private: boolean;
    created_at: Date;
    updated_at: Date;
}

export type Folder = {
    path: string;
    parent?: Folder;
    children?: Folder[];
}