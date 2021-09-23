import path from "path";
import fs from "fs";
import matter from "gray-matter";


export type Post = {
	name: string;
	title: string;
	author: string;
};


export default function getAllPosts(): Post[] {
	const directoryPath = "src/_meta/posts";
	const files = fs.readdirSync(directoryPath);

	let posts: Post[] = [];

	for (const file of files) {
		const name = file.substring(0, file.lastIndexOf("."));

		const fileContents = fs.readFileSync(path.join(directoryPath, file));
		const meta = matter(fileContents).data;

		if (!(meta.title && meta.author)) {
			console.error(
				"Warning - check if post " +
					file +
					" has the required front-matter (minimum title and author)"
			);
			console.error(
				"Putting 'ERROR' strings in the place of missing fields."
			);
			meta.title = meta.title ?? "ERROR_MISSING_TITLE";
			meta.author = meta.author ?? "ERROR_MISSING_AUTHOR";
		}

		posts.push({
			name,
			title: meta.title,
			author: meta.author,
		});
	}

    return posts;
}
