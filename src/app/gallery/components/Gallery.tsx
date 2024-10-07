'use client';
import React, { useState } from 'react'
import { GalleryImage } from './GalleryImage';

export const Gallery = ({ images }: { images: Record<string, string[]>}) => {

    const [expandedImage, setExpandedImage] = useState<number | null>(null);

    return (
        <div>
            {expandedImage}
            {Object.keys(images).map((section, index) => (
				<section key={index} className="mb-12">
					<h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-neutral-100">
						{section}
					</h2>
					<div className="flex flex-row flex-wrap gap-2">
						{images[section].map((image, imageIndex) => (
							<GalleryImage key={imageIndex} 
                                image={image} section={section} 
                                i={(imageIndex + 1) * (index + 1)} onClick={setExpandedImage}
                                expanded={expandedImage === (imageIndex + 1) * (index + 1)}
                            />
						))}
					</div>
				</section>
			))}
            
        </div>
    )
};

