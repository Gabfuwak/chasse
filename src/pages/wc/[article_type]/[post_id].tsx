//React
import React, { Fragment } from "react";
//Next
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import Head from "next/head";

//Parsing, HTML-ing, sanitizing
import { parseFrontMatter } from "@util/tools/parseCustomFM";
import snarkdown from "snarkdown";
import insane from "insane";
import parse, { domToReact, HTMLReactParserOptions } from "html-react-parser";

//Media query hook
import { useIsMobileMQ } from "@hooks/objmediaquery";

//CSS modules
import styles from "@styles/p/wc/post.module.css";

//Typescript object for the shape of the toilet metadata
import ToiletMetaDataShape from "@meta/toilets/data.shape";

//Used for little reading time indicator
import readingTime, { ReadTimeResults } from "reading-time";
import getAllPosts, { getAllReviews } from "@util/tools/getallposts";
import { extractHTMLText, roundReadingTime } from "@util/tools/postutils";

//Layout
import BasicNavFillLayout from "@util/components/layouts";

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
	const matches = useIsMobileMQ();

	const postJSX = parse(file.content, htmlParserOptions);

	const infos = {
		readingStats: stats,
		title: file.data.title,
		author: file.data.author,
	};

	return (
		<>
			<Head>
				<title>{infos.title}</title>
			</Head>

			<BasicNavFillLayout
				className={styles.post}
				fill={matches}
				center={!matches}
			>
				<article>
					<PostHeader info={infos} />

					<Fragment>{postJSX}</Fragment>
				</article>
			</BasicNavFillLayout>
		</>
	);
}

interface PostHeaderProps {
	info: {
		readingStats: ReadTimeResults;
		title: string;
		author: string;
	};
}

function PostHeader({ info }: PostHeaderProps) {
	let minutes: string | number = info.readingStats.minutes;
	let minuteText = `${minutes == 0 ? "moins d'une" : minutes} minute${
		minutes == 0 ? "" : "s"
	} de lecture`;

	return (
		<header className={styles.header}>
			<div>
				<h1>{info.title}</h1>

				<p>
					<span>{info.readingStats.words} mots </span>
					<span>({minuteText})</span>
				</p>
			</div>

			<div className={styles.meta}>
				<p>
					Par <span className={styles.author}>{info.author}</span>
				</p>
			</div>
		</header>
	);
}

//==//==//==//==//==//==//==//==//==//==//
//=====|        Server side        |====//
//==//==//==//==//==//==//==//==//==//==//

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = getAllPosts();
	const reviews = getAllReviews();

	type JSONPost = {
		name: string;
		title: string;
		author: string;
	};

	// Get the paths we want to pre-render based on posts
	const paths = posts.map((post: JSONPost) => ({
		params: { post_id: post.name, article_type: "post" },
	}));

	paths.push(
		...reviews.map((review: JSONPost) => ({
			params: { post_id: review.name, article_type: "review" },
		}))
	);

	// We'll pre-render only these paths at build time.
	// { fallback: false } means other routes should 404.
	return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
	let post_id = context.params?.post_id;
	let article_type = context.params?.article_type;

	if (Array.isArray(post_id)) {
		post_id = post_id[0];
	}

	let fileContents;

	if (article_type === "post") {
		fileContents = await import(`src/_meta/posts/${post_id}.md`);
	} else if (article_type === "review") {
		fileContents = await import(`src/_meta/toilets/${post_id}.md`);
	} else {
		//Does not exist
		return {
			notFound: true,
		};
	}

	const meta = parseFrontMatter(fileContents.default);

	const rawHTML = snarkdown(meta.content);

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
