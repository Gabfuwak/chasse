import React, { Fragment } from "react";
import Head from "next/head";

import useObjectMediaQuery, { useIsMobileMQ } from "@util/hooks/objmediaquery";
import compose from "@util/tools/composecss";

import styles from "@styles/u/post.module.css";
import toiletStyles from "@styles/u/toilet.module.css";

import ToiletBG from "@components/toiletbackground";
import { ReadTimeResults } from "reading-time";

interface PostHeaderProps {
	info: {
		readingStats: ReadTimeResults;
		title: string;
		author: string;
	};
}

interface PostProps extends PostHeaderProps {
	children: React.ReactNode;
}

export default function CoolPost({ children, info }: PostProps) {
	const matches = useIsMobileMQ();

	const blogAndMobilePostStyle = compose(
		styles.blogpost,
		matches ? styles.mobileBlogpost : undefined
	);

	return (
		<Fragment>
			<Head>
				<title>{info.title}</title>
			</Head>

			{/*< ToiletBG />*/}

			<article className={blogAndMobilePostStyle}>
				<PostHeader info={info}/>

				<Fragment>{children}</Fragment>
			</article>
		</Fragment>
	);
}

function PostHeader({ info }: PostHeaderProps) {
	let minutes: string | number = info.readingStats.minutes;
	let minuteText = `${minutes == 0 ? "moins d'une" : minutes} minute${
		minutes == 0 ? "" : "s"
	} de lecture`;

	return (
		<header>
			<h1>{info.title}</h1>

			<div>
				<p className={styles.blogAuthor}>Par {info.author}</p>
				<p className={styles.blogAuthor}>
					<span>{info.readingStats.words} mots </span>
					<span>({minuteText})</span>
				</p>
			</div>
		</header>
	);
}
