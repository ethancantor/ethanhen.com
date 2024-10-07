'use client';
import React, { useState } from 'react'
import { GalleryImage } from './GalleryImage';
import { imgListType } from '../page';

export const Gallery = ({imgList}: { imgList: imgListType[] }) => {

    const [expandedImage, setExpandedImage] = useState<number | null>(null);

    const images = imgList.reduce((acc: Record<string, string[]>, val: imgListType) => {
        if(!acc[val.categoryName]) acc[val.categoryName] = [];
        acc[val.categoryName].push(val.image)
        return acc
    }, {});

    const indexMap = imgList.map((val) => `${val.image}_${val.categoryName}`)

    return (
        <div>
            {Object.keys(images).map((section, index) => (
				<section key={section + index} className="mb-12">
					<h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-neutral-100">
						{section}
					</h2>
					<div className="flex flex-row flex-wrap gap-2">
						{images[section].map((image) => {
                            const imgIndex = indexMap.indexOf(`${image}_${section}`);
                            return (
                                <GalleryImage key={imgIndex} 
                                image={image} section={section} 
                                i={imgIndex} onClick={setExpandedImage}
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

