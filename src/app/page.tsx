import Link from 'next/link'
import React from 'react'

export default function Home () {
    return (
        <main className="h-screen w-screen flex flex-col justify-center items-center gap-4">
            <h1 className="text-3xl font-bold">ethanhen</h1>
            <div className='flex flex-col text-center gap-4 items-center'>
                <Link href='/gallery' className='italic flex flex-row gap-1 items-center group hover:underline relative'> 
                    gallery 
                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg" 
                    className='group-hover:translate-x-1 transition absolute ms-12'>
                        <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </Link>
                <Link href='/fileupload' className='italic flex flex-row gap-1 items-center group hover:underline relative'> 
                    files 
                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg" 
                        className='group-hover:translate-x-1 transition absolute ms-8'>
                        <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </Link>
            </div>
        </main>
    )
}
