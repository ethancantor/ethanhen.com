import path from "path";
import fs from "fs";
import { StaticImageData } from "next/image";
import { Gallery } from "@/components/gallery";

export type imgListType = { id: number, src: string | StaticImageData, alt: string, category: string }
export const dynamic = "force-dynamic";

async function fetchImages() {
	const imageDir = path.join(process.cwd(), "/files/gallery");
	const imgCateoryNames = fs.readdirSync(imageDir);

	const imageList: imgListType[] = []
	let id = 0;

	for(const category of imgCateoryNames){
		const images = fs.readdirSync(imageDir + '/' + category);
		for(const image of images){
			if(!(image.endsWith('.png') || image.endsWith('.jpg') || image.endsWith('.jpeg') || image.endsWith('.svg') || image.endsWith('.webp') || image.endsWith('.gif'))) continue;
			try{ 
				const img: StaticImageData = await import(`/files/gallery/${category}/${image}`);
				imageList.push({ src: img, category, alt: image, id: id++ });
			} catch(err){
				console.log(err);
			}
		}
	}

	return { imageList };
}

type SearchParams = {
	image?: string
}

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {

	const { imageList } = await fetchImages();

	const { image } = await searchParams;

	return (
		<div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 p-4 sm:p-6 md:p-8 transition-colors duration-300">
			<Gallery images={JSON.parse(JSON.stringify(imageList))} image={image ? parseInt(image) : undefined} />
		</div>
	);
}
