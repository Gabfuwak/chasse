import React, { Fragment } from "react";
import Head from "next/head";

import useObjectMediaQuery, { useIsMobileMQ } from "@util/hooks/objmediaquery";
import compose from "@util/tools/composecss";

import styles from "@styles/u/post.module.css";
import toiletStyles from "@styles/u/toilet.module.css";

import ToiletBG from "@components/toiletbackground";
import { ReadTimeResults } from "reading-time";

interface PostProps {
	children: React.ReactNode;

	info: {
		readingStats: ReadTimeResults;
		title: string;
		author: string;
	};
}

export default function CoolPost({ children, info }: PostProps) {
	const matches = useIsMobileMQ();

	const blogAndMobilePostStyle = compose(
		styles.blogpost,
		matches ? styles.mobileBlogpost : undefined
	);

	let minutes: string | number = info.readingStats.minutes;
	let minuteText = `${minutes == 0 ? "moins d'une" : minutes} minute${
		minutes == 0 ? "" : "s"
	} de lecture`;

	return (
		<Fragment>
			<Head>
				<title>{info.title}</title>
			</Head>

			<ToiletBG />

			<div className={toiletStyles.realPageBG}>
				<div className={styles.blogpostContainer}>
					<div className={blogAndMobilePostStyle}>
						<div>
							<h1>{info.title}</h1>

							<div>
								<p className={styles.blogAuthor}>
									Par {info.author}
								</p>
								<p className={styles.blogAuthor}>
									<span>{info.readingStats.words} mots </span>
									<span>({minuteText})</span>
								</p>
							</div>
						</div>

						<Fragment>{children}</Fragment>
					</div>
				</div>
			</div>
		</Fragment>
	);
}
