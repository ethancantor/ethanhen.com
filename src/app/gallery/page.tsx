import path from "path";
import fs from "fs";
import { StaticImageData } from "next/image";
import { Gallery } from "@/components/gallery";

export type imgListType = { id: number, src: string | StaticImageData, alt: string, category: string }
export const dynamic = "force-dynamic";

async function fetchImages() {
	const imageDir = path.join(process.cwd(), "/gallery");
	const imgCateoryNames = fs.readdirSync(imageDir);

	const imageList: imgListType[] = []
	let id = 0;

	for(const category of imgCateoryNames){
		const images = fs.readdirSync(imageDir + '/' + category);
		for(const image of images){
			const img: StaticImageData = await import(`/gallery/${category}/${image}`);
			imageList.push({ src: img, category, alt: image, id: id++ });
		}
	}
	return { imageList };
}

export default async function Home() {

	const { imageList } = await fetchImages();

	return (
		<div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 p-4 sm:p-6 md:p-8 transition-colors duration-300">
			<Gallery images={JSON.parse(JSON.stringify(imageList))}/>
			{/* <Gallery imgList={JSON.parse(JSON.stringify(imageList))}/> */}
		</div>
	);
}
