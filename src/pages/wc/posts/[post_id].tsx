import matter from "gray-matter";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React, { Fragment, useEffect } from "react";

import marked from "marked";
import insane from "insane";

import useObjectMediaQuery from "@hooks/objmediaquery";

import styles from "@styles/p/wc/posts/post_id.module.css";
import compose from "@tools/composecss";

interface PostProps {
	id: string;
	meta: matter.GrayMatterFile<any>;
	content: string;
}

export default function Page({ id, meta, content }: PostProps) {
	const matches = useObjectMediaQuery({
		screen: true,
		maxAspectRatio: "19/20",
	});

	return (
		<Fragment>
			<div className={styles.fakePageBackground} />

			<div className={styles.realPageBG}>
				<Head>
					<title>{meta.data.post_title}</title>
				</Head>

				<div className={styles.blogpostContainer}>
					<div
						className={compose(
							styles.blogpost,
							matches ? styles.mobileBlogpost : undefined
						)}
					>
						<h1>{meta.data.post_title}</h1>
						<p>By {meta.data.author}</p>

						<div dangerouslySetInnerHTML={{ __html: content }} />
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	let post_id = context.params?.post_id;
	if (Array.isArray(post_id)) {
		post_id = post_id[0];
	}

	const fileContents = await require(`src/_posts/wc/${post_id}.md`);
	const meta = matter(fileContents.default);
	const unsafeContent = marked(meta.content);

	const content = insane(
		unsafeContent,
		{
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

	return {
		props: {
			id: post_id,
			meta: {
				data: meta.data,
			},
			content,
		},
	};
};
