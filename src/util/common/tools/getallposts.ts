import path from "path";
import fs from "fs";
import matter from "gray-matter";
import readingTime, { ReadTimeResults } from "reading-time";
import { extractHTMLText, roundReadingTime } from "./postutils";
import marked from "marked";

export type TruncatedReadTimeResults = ReadTimeResults & {
	originalMinutes: number;
};

export interface Post {
	name: string;

	title: string;
	author: string;

	data: {
		readingStats: TruncatedReadTimeResults;

		explorer: {
			/**
			 * A hint to anyone who wants
			 * to index posts as to whether the
			 * post _should_ be indexed.
			 * This is by no mean an obligation,
			 * as all data will still be returned.
			 */
			hint_visible: boolean;
			description: string;
		};
	};
};

export function getVisiblePosts(): Post[] {
	const posts = getAllPosts();
	//console.log(posts);

	const resultPosts: Post[] = [];

	for (let post of posts) {
		if (post.data.explorer.hint_visible) {
			resultPosts.push(post);
		}
	}

	return resultPosts;
}

export default function getAllPosts(): Post[] {
	//Big thanks to
	//https://robkendal.co.uk/blog/use-webpack-and-require-context-to-load-html-files
	//So I could NOT use 'fs'. Instead, use webpack require.context
	//typescript off for most of that

	let posts: Post[] = [];

	((context: any) => {
		context.keys().forEach((key: any) => {
			const name = key.substring("./".length, key.lastIndexOf("."));

			if (name.indexOf("/") !== -1) {
				return;
			}

			const mattered = matter(context(key).default);

			const meta = mattered.data;

			const ERROR_STRING = "ERROR_MISSING_DATA";

			meta.title ??= ERROR_STRING;
			meta.author ??= ERROR_STRING;

			meta.explorer ??= {}; // explorer is an object;
			meta.explorer.description ??= ERROR_STRING;
			meta.explorer.hint_visible ??= true; //If this field is wrong we probably shouldn't see it.

			const markdown = mattered.content;
			const rawText = extractHTMLText(marked(markdown));

			const rawReadingStats = readingTime(rawText);
			const readingStats = {
				...rawReadingStats,
				originalMinutes: rawReadingStats.minutes,
			};
			readingStats.minutes = roundReadingTime(readingStats.minutes);

			posts.push({
				name,
				title: meta.title,
				author: meta.author,

				data: {
					readingStats,

					explorer: meta.explorer,
				},
			});
		});
	})(require.context("src/_meta/posts", false, /.md$/));

	return posts;
}
