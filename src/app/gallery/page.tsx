import Gallery from "@/components/gallery";
import fs from "fs";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

type SearchParams = {
	image?: string
}

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {

	const { image } = await searchParams;

	return (
		<div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 p-4 sm:p-6 md:p-8 transition-colors duration-300">
			<Suspense fallback={<div/>}>
				<Gallery image={image ? parseInt(image) : undefined} />
			</Suspense>
		</div>
	);
}
