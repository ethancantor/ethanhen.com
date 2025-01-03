'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, LinkIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import { DialogDescription, DialogTitle } from './dialog'
import { GalleryImage } from './gallery-image'
import { Button } from './ui/button'

export interface image_type {
  name: string
  folder: string
}

function Gallery({image }: { image?: number }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(image || null)
  const router = useRouter();
  const pathname = usePathname();

  const { data, error, isLoading } = useSWR('/api/gallery', (url) => fetch(url).then((res) => res.json()))

  const [images, setImages] = useState<image_type[]>([]);

  useEffect(() => {
    if(!error && !isLoading && data && data.length > 0) {
      setImages(data);
    }
  }, [data, error, isLoading])

  const [lastMoved, setLastMoved] = useState(0);

  const MAX_ARROW_TIMEOUT = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      if(lastMoved < MAX_ARROW_TIMEOUT) setLastMoved(lastMoved + 1);
      else clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastMoved, setLastMoved]);

  const categories = images.reduce((acc: string[], image: image_type ) => {
    if (!acc.includes(image.folder)) acc.push(image.folder)
    return acc
  }, [] as string[])

  const handleImageClick = useCallback((index: number | null) => {
    setSelectedImageIndex(index);
    if(index !== null) {
      router.replace(`${pathname}?image=${index}`, { scroll: false });
      setLastMoved(0);
    } else {
      router.replace(`${pathname}`, { scroll: false });
    }
  }, [pathname, router])

  const handlePrevious = useCallback(() => {
    setLastMoved(0);
    const newIDX = selectedImageIndex ? selectedImageIndex - 1 : images.length - 1;
    handleImageClick(newIDX);
  }, [handleImageClick, images.length, selectedImageIndex])

  const handleNext = useCallback(() => {
    setLastMoved(0);
    const newIDX = (selectedImageIndex !== null && selectedImageIndex < images.length - 1) ? selectedImageIndex + 1 : 0;
    handleImageClick(newIDX);
  }, [handleImageClick, images.length, selectedImageIndex])

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') handlePrevious()
    else if (event.key === 'ArrowRight') handleNext()
  }, [handlePrevious, handleNext])

  if(isLoading) return <div className="text-2xl w-full h-full flex items-center justify-center">Loading...</div>

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
                {images.filter((image) => image.folder === category).map((image) => (
                  <button className='w-fit h-fit' key={image.name + " " + image.folder} onClick={() => handleImageClick(images.indexOf(image))}>
                    <GalleryImage image={image} quality={10} />
                  </button>
                ))}
              </div>
            </section>
          ))
        }
      </div>
      <Dialog open={selectedImageIndex !== null} onOpenChange={(open) => !open && handleImageClick(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 w-full h-full" onKeyDown={handleKeyDown} >
          <DialogTitle />
          <DialogDescription />
          {selectedImageIndex !== null && images[selectedImageIndex] && (
            <div className="absolute w-full h-full">
                <GalleryImage image={images[selectedImageIndex]} quality={100} fill />
              <div className='absolute left-0 top-0 translate translate-y-[4rem] w-[15%] lg:w-[5%] h-[calc(100%-8rem)] cursor-pointer'
                onClick={handlePrevious}  >
                <ChevronLeft className={`h-full w-full text-white ${lastMoved < MAX_ARROW_TIMEOUT ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`} />
              </div>
              <div className='absolute right-0 top-0 translate translate-y-[4rem] w-[15%] lg:w-[5%]  h-[calc(100%-8rem)] cursor-pointer'
                onClick={handleNext}>
                <ChevronRight className={`h-full w-full text-white ${lastMoved < MAX_ARROW_TIMEOUT ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`} />
              </div>
            </div>
          )}
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

export default dynamic(() => Promise.resolve(Gallery), { ssr: false });