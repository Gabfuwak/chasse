import fs, { read, stat } from "fs";

import { GetServerSideProps } from "next";
import Head from "next/head";
import React, { Fragment } from "react";

import matter from "gray-matter";
import marked from "marked";
import insane from "insane";

import useObjectMediaQuery from "@hooks/objmediaquery";

import styles from "@styles/p/wc/post_generals.module.css";
import toiletStyles from "@styles/u/toilet.module.css";

import compose from "@tools/composecss";
import ToiletBG from "@components/toiletbackground";

import ToiletMetaDataShape from "@meta/toilets/data.shape";

import readingTime, { ReadTimeResults } from "reading-time";
import Link from "next/link";



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
	const matches = useObjectMediaQuery(
		{
			screen: true,
			maxAspectRatio: "19/20", //{text, minutes, words}
		},
		{
			screen: true,
			maxWidth: "60ch",
		}
	);

	const blogAndMobilePostStyle = compose(
		styles.blogpost,
		matches ? styles.mobileBlogpost : undefined
	);

	let minutes: string | number = stats.minutes;
	let lessThan = "";
	/**
	 * Si il y a plusieurs minutes,
	 * minutes s'écrit avec un s,
	 * sinon sans s.
	 */
	let minuteWordEnding = "s";

	if (minutes == 0) {
		lessThan = "moins d'";
		minutes = "une";
		minuteWordEnding = "";
	}

	return (
		<Fragment>
			<Head>
				<title>{file.data.title}</title>
			</Head>

			<ToiletBG />

			<div className={toiletStyles.realPageBG}>
				<div className={styles.blogpostContainer}>
					<div className={blogAndMobilePostStyle}>
						<div>
							<h1>{file.data.title}</h1>

							<div>
								<p className={styles.blogAuthor}>
								Par {file.data.author}
								</p>
								<p className={styles.blogAuthor}>
								<span>{stats.words} mots </span>
								<span>
								({lessThan}{minutes} {"minute" + minuteWordEnding}{" "} de lecture)
								</span>
								</p>
							</div>

						</div>

						<div
							dangerouslySetInnerHTML={{ __html: file.content }}
						/>
					</div>
				</div>
			</div>
		</Fragment>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
	let post_id = context.params?.post_id;
	if (Array.isArray(post_id)) {
		post_id = post_id[0];
	}

	const fileContents = await import(`src/_meta/posts/wc/${post_id}.md`);
	const meta = matter(fileContents.default);
	const unsafeContent = marked(meta.content);

	const rawText = extractHTMLText(meta.content);
	const readingStats = readingTime(rawText);
	readingStats.minutes = roundReadingTime(readingStats.minutes);


	let linksTexts: string[] = [];
	//I could have used complex regex for this
	//But I enjoy staying somewhat sane.

	//Take all the texts of inside <a> tags
	//Put it here for later access
	//Because insane() filter doesn't give
	//Access to children tags
	//So to use a next <Link> and put inside it the text we do that
	//FIXME: tired description

	const matches = Array.from(unsafeContent.matchAll(/<a/g));
	for(const match of matches) {
		if(match.index == undefined) {
			continue;
		}
		if(unsafeContent[match.index - 1] === '\\') {
			continue;
		}

		let closingForOpen = unsafeContent.indexOf('>', match.index);
		let closingTag = unsafeContent.indexOf('</a>', closingForOpen);
		let content = unsafeContent.substring(closingForOpen + 1, closingTag);

		linksTexts.push(content);
	}

	let linksTextCounter = 0;

	const content = insane(
		unsafeContent,
		{
			allowedTags: insane.defaults.allowedTags.concat(['cite']),
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
				
				if (token.tag === 'a') {
					token = (() => (<Link href={token.attrs['href']}> 
							<a>
								{linksTexts[linksTextCounter]}
							</a>
						</Link>))();
				}

				return true;
			},
		},
		false
	);


	return {
		props: {
			id: post_id,
			file: {
				data: meta.data,
				content,
			},
			stats: readingStats,
		},
	};
};
