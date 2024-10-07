'use client';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import Image from 'next/image'
import React, { useRef } from 'react'

export const GalleryImage = ({ image, section, onClick, i, expanded } : 
    { image : string, section: string, onClick: (index: number | null) => void, i: number, expanded: boolean }) => {

    const divRef = useRef(null);
    const imgRef = useRef(null);

    useOutsideClick([divRef, imgRef], () => onClick(null), expanded);

    return (
        <div className="relative overflow-hidden rounded-lg shadow-md transition-all duration-300 ease-in-out max-h-64 max-w-64 p-2 bg-neutral-800" 
            ref={imgRef}
        >
            <Image
                src={`/images/${section}/${image}`}
                alt={image}
                className="transition-transform duration-300 ease-in-out hover:scale-110 w-fit h-fit rounded-lg"
                width={500}
                height={500}
                quality={50}
                onClick={() => onClick(i)}
            />
            <div className={`fixed max-w-[55vw] h-fit z-10 py-10 flex flex-row gap-6 px-5
                ${expanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} 
                transition-opacity duration-300 ease-in-out bg-neutral-800 inset-0 mx-auto my-auto
                rounded-lg drop-shadow-lg`} ref={divRef}>
                <div className='flex justify-center items-center rotate-180'
                    onClick={() => onClick(i - 1)}
                >
                    <svg width="50px" height="50px" viewBox="0 0 32.00 32.00" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff" strokeWidth="1.696">
                        <path className="cls-1" d="M10.05,29.73a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42L20.66,16.71a1,1,0,0,0,0-1.42L9.34,4a1,1,0,0,1,1.42-1.42L22.07,13.88a3,3,0,0,1,0,4.24L10.76,29.44A1,1,0,0,1,10.05,29.73Z" />
                    </svg>
                </div>
                <Image
                    src={`/images/${section}/${image}`}
                    alt={image}
                    loading='lazy'
                    sizes='100vw'
                    width={1000} height={1000}
                    className="object-contain rounded-lg"
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                    quality={100}
                />
                <div className='flex justify-center items-center'
                    onClick={() => onClick(i + 1)}
                >
                    <svg width="50px" height="50px" viewBox="0 0 32.00 32.00" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff" strokeWidth="1.696">
                        <path className="cls-1" d="M10.05,29.73a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42L20.66,16.71a1,1,0,0,0,0-1.42L9.34,4a1,1,0,0,1,1.42-1.42L22.07,13.88a3,3,0,0,1,0,4.24L10.76,29.44A1,1,0,0,1,10.05,29.73Z" />
                    </svg>
                </div>
            </div>
        </div>
    )
}
