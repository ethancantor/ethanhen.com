import Image from "next/image";

export function ScrollableGalleryComponent({ images }: { images: Record<string, string[]>}) {
	return (
		<div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 p-4 sm:p-6 md:p-8 transition-colors duration-300">
			{Object.keys(images).map((section, index) => (
				<section key={index} className="mb-12">
					<h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-neutral-100">
						{section}
					</h2>
					<div className="flex flex-row flex-wrap gap-2">
						{images[section].map((image, imageIndex) => (
							<div
								key={imageIndex}
								className="relative overflow-hidden rounded-lg shadow-md transition-all duration-300 ease-in-out max-h-64 max-w-64"
							>
								<Image
									src={`/images/${section}/${image}`}
									alt={image}
									className="transition-transform duration-300 ease-in-out hover:scale-110 w-fit h-fit"
									width={500}
									height={500}
								/>
							</div>
						))}
					</div>
				</section>
			))}
		</div>
	);
}
