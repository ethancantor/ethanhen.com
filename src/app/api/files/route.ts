import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if(session?.user?.role !== 'admin') return new Response('Unauthorized', { status: 401 });
    console.log(request);
}

export async function POST(request: Request){
    console.log(request);
    const session = await getServerSession(authOptions);
    if(session?.user?.role !== 'admin') return new Response('Unauthorized', { status: 401 });

    const formData = await request.formData();
    console.log(formData);

}