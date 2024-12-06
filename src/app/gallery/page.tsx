import path from "path";
import fs from "fs";
import Gallery from "@/components/gallery";
import { Suspense } from "react";

export type imgListType = { id: number, src: string, alt: string, category: string, stats: fs.Stats }
export const dynamic = "force-dynamic";

const HOST_NAME = process.env.NEXTAUTH_URL;
const CDN_URL = `${HOST_NAME}/api/images`

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
				// const stats = fs.statSync(`${imageDir}/${category}/${image}`);
				const stats = {} as fs.Stats;
				imageList.push({ src: `${CDN_URL}?category=${category}&image=${image}`, category, alt: image, id: id++, stats });
			} catch(err){}
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
			<Suspense fallback={<div/>}>
				<Gallery images={JSON.parse(JSON.stringify(imageList))} image={image ? parseInt(image) : undefined} />
			</Suspense>
		</div>
	);
}
