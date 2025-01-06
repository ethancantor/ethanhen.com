'use client';
import React, { memo } from 'react'
import useSWR from 'swr';
import Image from 'next/image';
import { Loader } from 'lucide-react';
import { File } from '@/types/db_types';

export const GalleryImage = memo(function GalleryImage({ image, quality = 100, fill } : { image: File, quality?: number, fill?: boolean }){

    const { data: image_data, error: image_error, isLoading: image_loading } = useSWR(`/api/images?image=${image.path}&quality=${quality}`, (url) => fetch(url).then((res) => res.blob()))
    const { data: meta_data, error: meta_error, isLoading: meta_loading} = useSWR(`/api/image-data?image=${image.path}`, (url) => fetch(url).then((res) => res.json()))
    
    if(image_loading || meta_loading) return <div className='w-full h-full flex items-center justify-center' >
        <Loader className='animate-spin'/>
    </div>

    if(!image_error && !image_loading && image_data && meta_data && !meta_error) {
        const url = URL.createObjectURL(image_data);
        return (
            <div className='w-full h-full'>
                { fill ? <Image src={url} alt={image.path} className='w-full h-full object-contain' fill /> :
                <Image src={url} alt={image.path} width={meta_data.width || 0} height={meta_data.height || 0} className='w-fit h-fit object-cover' /> }
            </div>
        )
    }

    return <div>{image_error + " " + meta_error || 'Failed to load image'}</div>
});

