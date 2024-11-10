'use client';
import React, { useState } from 'react'
import { GalleryImage } from './GalleryImage';
import { imgListType } from '../page';
import { StaticImageData } from 'next/image';

export const Gallery = ({imgList}: { imgList: imgListType[] }) => {

    const [expandedImage, setExpandedImage] = useState<number | null>(null);

    const images = imgList.reduce((acc: Record<string, {image: StaticImageData, imageName: string}[]>, val: imgListType) => {
        if(!acc[val.categoryName]) acc[val.categoryName] = [];
        acc[val.categoryName].push({image: val.image, imageName: val.imgName});
        return acc
    }, {});

    const indexMap = imgList.map((val) => `${val.imgName}_${val.categoryName}`);

    return (
        <div>
            {Object.keys(images).map((section, sectionIdx) => (
				<section key={section + sectionIdx} className="mb-12">
					<h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-neutral-100">
						{section} {sectionIdx}
					</h2>
					<div className="flex flex-row flex-wrap gap-2">
						{images[section].map((image) => {
                            const imgIndex = indexMap.indexOf(`${image.imageName}_${section}`);
                            return (
                                <GalleryImage key={imgIndex} 
                                image={image.image} 
                                i={imgIndex} onClick={(i: number | null) => {
                                    setExpandedImage(i);
                                }}
                                expanded={expandedImage === imgIndex}
                            />
                            )
                        })}
					</div>
				</section>
			))}
        </div>
    )
};

