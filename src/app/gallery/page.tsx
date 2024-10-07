import path from "path";
import fs from "fs";
import { Gallery } from "./components/Gallery";

export type imgListType = {image: string, categoryName: string}
export const dynamic = "force-dynamic";

async function fetchImages() {
	const imageDir = path.join(process.cwd(), "/public/images");
	const imgCateoryNames = fs.readdirSync(imageDir);

	const imageList: imgListType[] = []

	for(const categoryName of imgCateoryNames){
		const images = fs.readdirSync(imageDir + '/' + categoryName);
		for(const image of images){
			imageList.push({image, categoryName});
		}
	}
	return { imageList };
}

export default async function Home() {

	const { imageList } = await fetchImages();

	return (
		<div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 p-4 sm:p-6 md:p-8 transition-colors duration-300">
			<Gallery imgList={imageList}/>
		</div>
	);
}
