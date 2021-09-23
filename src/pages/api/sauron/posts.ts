import type { NextApiRequest, NextApiResponse } from "next";

import path from "path";
import fs from "fs";
import matter from "gray-matter";
import getAllPosts, { Post } from "@util/tools/getallposts";


type Data = {
	number: number;
	posts: Post[];
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const posts = getAllPosts();

	res.status(200).json({ number: posts.length, posts });
};
