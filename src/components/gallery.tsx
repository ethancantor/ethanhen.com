'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { imgListType } from '@/app/gallery/page'
import { DialogDescription, DialogTitle } from './dialog'
import { Button } from './ui/button' 
import { ChevronLeft, ChevronRight, LinkIcon } from 'lucide-react'

export function Gallery({images }: { images: imgListType[] }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  const [lastMoved, setLastMoved] = useState(0);

  const MAX_ARROW_TIMEOUT = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      if(lastMoved < MAX_ARROW_TIMEOUT) setLastMoved(lastMoved + 1);
      else clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastMoved, setLastMoved]);

  const categories = images.reduce((acc, image) => {
    if (!acc.includes(image.category)) acc.push(image.category)
    return acc
  }, [] as string[])

  const handlePrevious = useCallback(() => {
    setLastMoved(0);
    setSelectedImageIndex((prevIndex) => 
      prevIndex !== null ? (prevIndex - 1 + images.length) % images.length : null
    )
  }, [images])

  const handleNext = useCallback(() => {
    setLastMoved(0);
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
            <section key={category} className='mt-20' id={category}>
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 space-x-2 flex items-center">
                <span>{category}</span>
                <CopyButton category={category} />
              </h3>
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
            </section>
          ))
        }
      </div>
      <Dialog open={selectedImageIndex !== null} onOpenChange={(open) => !open && setSelectedImageIndex(null)} >
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 w-full h-full" onKeyDown={handleKeyDown}>
          <DialogTitle />
          {selectedImageIndex !== null && images[selectedImageIndex] && (
            <div className="w-full h-full ">
              <Image
                src={images[selectedImageIndex].src}
                alt={images[selectedImageIndex].alt}
                fill
                style={{ objectFit: 'contain' }}
              />
              <Button
                className="left-4 top-1/2 transform -translate-y-1/2 lg:absolute hidden"
                onClick={handlePrevious}
                aria-label="Previous image"
                variant={'ghost'}
                size={'icon'}
              >
                <ChevronLeft className="h-16 w-16" />
              </Button>
              <Button
                className="right-4 top-1/2 transform -translate-y-1/2 lg:absolute hidden"
                onClick={handleNext}
                aria-label="Next image"
                variant={'ghost'}
                size='icon'
              >
                <ChevronRight className="h-16 w-16" />
              </Button>

              <div className='lg:hidden absolute left-0 top-0 translate translate-y-[4rem] w-[15%] h-[calc(100%-8rem)]'
                onClick={handlePrevious}  >
                <ChevronLeft className={`h-full w-full text-white ${lastMoved < MAX_ARROW_TIMEOUT ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`} />
              </div>
              <div className='lg:hidden absolute right-0 top-0 translate translate-y-[4rem] w-[15%] h-[calc(100%-8rem)]'
                onClick={handleNext}>
                <ChevronRight className={`h-full w-full text-white ${lastMoved < MAX_ARROW_TIMEOUT ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`} />
              </div>
            </div>
          )}
          <DialogDescription />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CopyButton({ category }: { category: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <Button variant={'ghost'} size={'icon'} 
      className={`${copied ? 'outline outline-1 outline-green-500' : 'outline outline-1 outline-zinc-900'} transition-all duration-200`}
    onClick={() => {
      setCopied(true);
      navigator.clipboard.writeText(`https://ethanhen.com/gallery#${category}`);
      setTimeout(() => setCopied(false), 500);
    }}>
      <LinkIcon className={`w-4 h-4 ${copied ? 'text-green-500' : ''} transition-colors duration-200`} />
    </Button>
  )
}