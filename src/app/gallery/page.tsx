import { ScrollableGalleryComponent } from "@/components/scrollable-gallery";
import path from "path";
import fs from "fs";

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
      <ScrollableGalleryComponent images={images} />
  );
}
