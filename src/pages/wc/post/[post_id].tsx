import fs, { read, stat } from "fs";

//React
import React, { Fragment, ReactNode } from "react";
//Next
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

//Parsing mardown into html into JSX
import matter from "gray-matter";
import marked from "marked";
import insane from "insane";
import parse, {
	domToReact,
	HTMLReactParserOptions,
	DOMNode,
} from "html-react-parser";
import ReactDOMServer from "react-dom/server";

//Media query hook
import useObjectMediaQuery from "@hooks/objmediaquery";

//CSS modules
import styles from "@styles/u/post.module.css";
import toiletStyles from "@styles/u/toilet.module.css";
//CSS utility function + nice background
import compose from "@tools/composecss";

//Typescript object for the shape of the toilet metadata
import ToiletMetaDataShape from "@meta/toilets/data.shape";

//Used for little reading time indicator
import readingTime, { ReadTimeResults } from "reading-time";
import CoolPost from "@util/components/post";
import getAllPosts from "@util/tools/getallposts";

//Placed here so we don't have to serialize it
const htmlParserOptions: HTMLReactParserOptions = {
	replace: (domNode: any) => {
		//? Had to turn off typescript type checking here

		if (domNode.type === "text") {
			return;
		}

		if (domNode.name === "a") {
			return (
				//href has to exist here
				<Link href={domNode.attribs.href}>
					<a>{domToReact(domNode.children, htmlParserOptions)}</a>
				</Link>
			);
		}
	},
};

interface PostProps {
	id: string;
	file: {
		data: {
			[key: string]: any;
		};
		content: string;
	};
	meta: ToiletMetaDataShape;
	stats: ReadTimeResults;
}

export default function Page({ id, file, meta, stats }: PostProps) {
	const postJSX = parse(file.content, htmlParserOptions);

	return (
		<CoolPost
			info={{
				readingStats: stats,
				title: file.data.title,
				author: file.data.author,
			}}
		>
			{postJSX}
		</CoolPost>
	);
}

function roundReadingTime(time: number) {
	if (time < 0.8) {
		time = 0;
	} else {
		time = Math.ceil(time);
	}

	return time;
}

function extractHTMLText(htmlString: string) {
	let resultText = "";
	let tagBuffer = "";

	let inTagDeclaration = false;

	for (let char of htmlString) {
		if (inTagDeclaration) {
			if (char === "<") {
				inTagDeclaration = true;
			} else if (char === ">") {
				console.log(tagBuffer);
				tagBuffer = "";
				inTagDeclaration = false;
			} else {
				tagBuffer += char;
			}
		} else {
			resultText += char;
		}
	}

	return resultText;
}

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = getAllPosts();

	type JSONPost = {
		name: string;
		title: string;
		author: string;
	};

	// Get the paths we want to pre-render based on posts
	const paths = posts.map((post: JSONPost) => ({
		params: { post_id: post.name },
	}));

	// We'll pre-render only these paths at build time.
	// { fallback: false } means other routes should 404.
	return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
	let post_id = context.params?.post_id;
	if (Array.isArray(post_id)) {
		post_id = post_id[0];
	}

	const fileContents = await import(`src/_meta/posts/${post_id}.md`);
	const meta = matter(fileContents.default);

	const rawHTML = marked(meta.content);

	const sanitizedHTML: string = insane(
		rawHTML,
		{
			allowedTags: insane.defaults.allowedTags.concat(["cite"]),
			allowedAttributes: {
				img: ["src", "alt"],
				code: ["class"],
				ul: ["listtype", "class"],
			},
			filter: (token: any) => {
				if (token.tag === "ul") {
					if (token.attrs["listtype"]) {
						delete token.attrs.listtype;
						token.attrs.class = styles.imageflow;
					}
				}

				return true;
			},
		},
		false
	);

	//get the reading time for the raw text (no html/markdown/jsx, pure readable text)
	const rawText = extractHTMLText(sanitizedHTML);
	const readingStats = readingTime(rawText);
	readingStats.minutes = roundReadingTime(readingStats.minutes);

	return {
		props: {
			id: post_id,
			file: {
				data: meta.data,
				content: sanitizedHTML,
			},
			stats: readingStats,
		},
	};
};
