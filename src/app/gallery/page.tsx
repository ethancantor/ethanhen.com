import path from "path";
import fs from "fs";
import { Gallery } from "./components/Gallery";
import { StaticImageData } from "next/image";

export type imgListType = {image: StaticImageData, categoryName: string}
export const dynamic = "force-dynamic";

async function fetchImages() {
	const imageDir = path.join(process.cwd(), "/public/gallery");
	const imgCateoryNames = fs.readdirSync(imageDir);

	const imageList: imgListType[] = []

	for(const categoryName of imgCateoryNames){
		const images = fs.readdirSync(imageDir + '/' + categoryName);
		for(const image of images){
			const img: StaticImageData = await import(`/public/gallery/${categoryName}/${image}`);
			imageList.push({image: img, categoryName});
		}
	}
	return { imageList };
}

export default async function Home() {

	const { imageList } = await fetchImages();

	return (
		<div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 p-4 sm:p-6 md:p-8 transition-colors duration-300">
			<Gallery imgList={JSON.parse(JSON.stringify(imageList))}/>
		</div>
	);
}
