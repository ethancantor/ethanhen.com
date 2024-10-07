import path from "path";
import fs from "fs";
import { Gallery } from "./components/Gallery";

async function fetchImages() {
	const imageDir = path.join(process.cwd(), "/public/images");
	const imgCateoryNames = fs.readdirSync(imageDir);

	const images: Record<string, string[]> = {};

	for(const categoryName of imgCateoryNames){
		images[categoryName] = fs.readdirSync(imageDir + '/' + categoryName);
	}
	return { images };
}

export default async function Home() {

	const { images } = await fetchImages();

	return (
		<div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 p-4 sm:p-6 md:p-8 transition-colors duration-300">
			<Gallery images={JSON.parse(JSON.stringify(images))} />
		</div>
	);
}
