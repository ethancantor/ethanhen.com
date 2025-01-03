'use client';
import React, { memo } from 'react'
import { image_type } from './gallery';
import useSWR from 'swr';
import Image from 'next/image';
import { Loader } from 'lucide-react';

export const GalleryImage = memo(function GalleryImage({ image, quality = 100, fill } : { image: image_type, quality?: number, fill?: boolean }){

    const { data: image_data, error: image_error, isLoading: image_loading } = useSWR(`/api/images?image=${image.name}&folder=${image.folder}&quality=${quality}`, (url) => fetch(url).then((res) => res.blob()))
    const { data: meta_data, error: meta_error, isLoading: meta_loading} = useSWR(`/api/image-data?image=${image.name}&folder=${image.folder}`, (url) => fetch(url).then((res) => res.json()))
    
    console.log('render image', image.name);


    if(image_loading || meta_loading) return <div className='w-full h-full flex items-center justify-center' >
        <Loader className='animate-spin'/>
    </div>

    if(!image_error && !image_loading && image_data && meta_data && !meta_error) {
        const url = URL.createObjectURL(image_data);
        return (
            <div className='w-full h-full'>
                { fill ? <Image src={url} alt={image.name} className='w-full h-full object-contain' fill /> : 
                <Image src={url} alt={image.name} width={meta_data.width} height={meta_data.height} className='w-fit h-fit object-cover' /> }
            </div>
        )
    }

    return <div>{image_error + " " + meta_error || 'Failed to load image'}</div>
});

