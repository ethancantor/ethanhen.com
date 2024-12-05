import { authOptions } from '@/utils/authOptions'
import { Lock, MoveRight, Unlock } from 'lucide-react';
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import React from 'react'

export default async function Home () {

    const session = await getServerSession(authOptions);

    return (
        <main className="h-screen w-screen flex flex-col justify-center items-center gap-4 text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                { Boolean(session) ?
                    <Unlock className='w-8 h-8 fixed top-3 right-3'/> : 
                    <Link href={'/api/auth/signin'}> <Lock className='w-8 h-8 fixed top-3 right-3'/> </Link>
                }
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">ethanhen</h1>
            <div className='flex flex-col text-center gap-4 items-center'>
                <Link href='/gallery' className='italic flex flex-row gap-1 md:gap-2 lg:gap-3 items-center group hover:underline relative'> 
                    <span>gallery</span>
                    <MoveRight className='w-5 h-5 sm:w-6 md:w-7 lg:w-8 sm:h-6 md:h-7 lg:h-8 group-hover:translate-x-1 transition'/>
                </Link>
                <Link href='/files' className='italic flex flex-row gap-1 md:gap-2 lg:gap-3 items-center group hover:underline relative'>  
                    <span>files</span>
                    <MoveRight className='w-5 h-5 sm:w-6 md:w-7 lg:w-8 sm:h-6 md:h-7 lg:h-8 group-hover:translate-x-1 transition'/>
                </Link>
                
                {Boolean(session) && <Link href='/fileupload' className='italic flex flex-row gap-1 md:gap-2 lg:gap-3 items-center group hover:underline relative'> 
                    <span>file yupload</span>
                    <MoveRight className='w-5 h-5 sm:w-6 md:w-7 lg:w-8 sm:h-6 md:h-7 lg:h-8 group-hover:translate-x-1 transition'/>
                </Link>}
            </div>
        </main>
    )
}
