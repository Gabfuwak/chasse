import type { NextApiRequest, NextApiResponse } from "next";

import path from "path";
import fs from "fs";
import matter from "gray-matter";
import getAllPosts, { getVisiblePosts, Post } from "@util/tools/getallposts";

type Data = {
	shown: number;
	posts: Post[];
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const posts =
		req.query.indexall === "true" ? getAllPosts() : getVisiblePosts();

	res.status(200).json({ shown: posts.length, posts });
};
