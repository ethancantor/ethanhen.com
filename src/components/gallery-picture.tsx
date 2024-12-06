import { imgListType } from "@/app/gallery/page"
import { Loader } from "lucide-react";
import dynamic from "next/dynamic"
import Image from "next/image"
import React, { useEffect } from "react"

function GalleryPicture({ image, images, onClick }: { image: imgListType, images: imgListType[], onClick: (img: number) => void }) {

    const [imageVal, setImageVal] = React.useState('');
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const fetchImage = async () => {
            const res = await fetch(image.src, { cache: 'no-cache' });
            if(res.status !== 200) return;
            setImageVal(res.url);
            setLoading(false);
        }
        fetchImage();
    }, [image.src]);

    return (
        <div key={image.id} className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onClick(images.indexOf(image))}>
            { loading && <div className="flex items-center justify-center w-full h-full rounded-lg">
                <Loader className="w-6 h-6 animate-spin" />
            </div> } 
            { !loading && <Image
                src={imageVal}
                alt={image.alt}
                width={200}
                height={200}
                className="rounded-lg object-cover w-full h-full aspect-square"
                loading='lazy'
            /> }
        </div>
    )
};


export default dynamic(() => Promise.resolve(GalleryPicture), { ssr: false });