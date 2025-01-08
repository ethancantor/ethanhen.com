'use client';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import { memo } from 'react';
import useSWR from 'swr';

export const GalleryImage = memo(function GalleryImage({ image, quality = 100, fill } : { image: string, quality?: number, fill?: boolean }){
    const { data: image_data, error: image_error, isLoading: image_loading } = useSWR(`/api/images?image=${image}&quality=${quality}`, (url) => fetch(url).then(
        async (res) => {
            const blob = await res.blob();
            const metdata = JSON.parse(res.headers.get('metadata') || '{}');
            return { data: blob, metadata: metdata }
        }
    ));
    
    if(image_loading) return <div className='w-full h-full flex items-center justify-center' >
        <Loader className='animate-spin'/>
    </div>

    if(!image_error && !image_loading && image_data) {
        const url = URL.createObjectURL(image_data.data);
        return (
            <div className='w-full h-full'>
                { fill ? <Image src={url} alt={image} className='w-full h-full object-contain' fill /> :
                <Image src={url} alt={image} width={image_data.metadata?.width || 0} height={image_data.metadata?.width || 0} className='w-fit h-fit object-cover' /> }
            </div>
        )
    }

    return <div>{image_error || 'Failed to load image'}</div>
});

