'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { imgListType } from '@/app/gallery/page'
import { DialogDescription, DialogTitle } from './dialog'
import { Button } from './ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Gallery({images }: { images: imgListType[] }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  const categories = images.reduce((acc, image) => {
    if (!acc.includes(image.category)) acc.push(image.category)
    return acc
  }, [] as string[])

  const handlePrevious = useCallback(() => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex !== null ? (prevIndex - 1 + images.length) % images.length : null
    )
  }, [images])

  const handleNext = useCallback(() => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex !== null ? (prevIndex + 1) % images.length : null
    )
  }, [images])

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') handlePrevious()
    else if (event.key === 'ArrowRight') handleNext()
  }, [handlePrevious, handleNext])


  return (
    <div>
      <div className="">
        {
          categories.map((category) => (
            <div key={category}>
              <h3 className="text-5xl font-semibold mb-2">{category}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.filter((image) => image.category === category).map((image) => (
                  <div key={image.id} className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setSelectedImageIndex(images.indexOf(image))}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={400}
                      height={400}
                      className="rounded-lg object-cover w-full h-full aspect-square"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        }
      </div>
      <Dialog open={selectedImageIndex !== null} onOpenChange={(open) => !open && setSelectedImageIndex(null)} >
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0" onKeyDown={handleKeyDown}>
          <DialogTitle />
          {selectedImageIndex !== null && images[selectedImageIndex] && (
            <div className="relative w-full h-full min-h-[50vh]">
              <Image
                src={images[selectedImageIndex].src}
                alt={images[selectedImageIndex].alt}
                fill
                style={{ objectFit: 'contain' }}
              />
              <Button
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                onClick={handlePrevious}
                aria-label="Previous image"
                variant={'ghost'}
                size={'icon'}
              >
                <ChevronLeft className="h-16 w-16" />
              </Button>
              <Button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 "
                onClick={handleNext}
                aria-label="Next image"
                variant={'ghost'}
                size='icon'
              >
                <ChevronRight className="h-16 w-16" />
              </Button>
            </div>
          )}
          <DialogDescription />
        </DialogContent>
      </Dialog>
    </div>
  )
}

