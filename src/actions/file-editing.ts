// 'use server';

// import { authOptions } from "@/utils/authOptions";
// import { getServerSession } from "next-auth";
// import { revalidatePath } from "next/cache";

// export async function deleteFile(path: string) {
//     const session = await getServerSession(authOptions);
//     if(!session) return { message: 'Unauthorized',  status: 401 };
    

//     revalidatePath(`/files`);
//     revalidatePath(`/gallery`);
//     return { message: 'OK',  status: 200 };
// }

// export async function deleteFolder(folder: string) {
//     const session = await getServerSession(authOptions);
//     if(!session) return { message: 'Unauthorized',  status: 401 };
    
//     revalidatePath(`/files`);
//     revalidatePath(`/gallery`);
//     return { message: 'OK',  status: 200 };
// }

// export async function renamePath(oldPath: string, newPath: string) {
//     const session = await getServerSession(authOptions);
//     if(!session) return { message: 'Unauthorized',  status: 401 };
    
//     try {

//         revalidatePath(`/files`);
//         revalidatePath(`/gallery`);
//         return { message: 'OK',  status: 200 };
//     } catch(err){ return { message: 'Error',  status: 500 }; }
// }

// export async function createSubFolder(path: string, folderName: string) {
//     const session = await getServerSession(authOptions);
//     if(!session) return { message: 'Unauthorized',  status: 401 };
    
//     try {

//         revalidatePath(`/files`);
//         revalidatePath(`/gallery`);
//         return { message: 'OK',  status: 200 };
//     } catch(err){ return { message: 'Error',  status: 500 }; }

// }