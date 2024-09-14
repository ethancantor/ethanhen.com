import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function Home () {
    return (
        <main className="h-screen w-screen flex flex-col justify-center items-center gap-4">
            <h1 className="text-3xl font-bold">Ethan Hensley</h1>
            <div className='flex flex-row gap-4'>
                <Link href='/gallery'> <Button>Gallery</Button> </Link>
                <Button>Files</Button>
            </div>
        </main>
    )
}
