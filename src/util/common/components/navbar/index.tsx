import { getVisiblePosts, Post } from "@util/tools/getallposts";
import { useIsMobileMQ } from "@util/hooks/objmediaquery";
import React from "react";

import { MobileAppNavbar } from "./mobile";
import { DesktopAppNavbar } from "./desktop";

export interface NavbarRenderableReference {
	/**
	 * The text to be displayed in the link
	 */
	name: string;
	/**
	 * The url the link will point to
	 */
	url: string;
	/**
	 * Extra lines to be displayed below the title
	 */
	extra?: string[];
}

export default function AppNavbar() {
	const isMobile = useIsMobileMQ();

	const posts = getVisiblePosts();

	const catsMap = new Map<string, NavbarRenderableReference[]>();
	catsMap.set(
		"posts",
		posts.map((value) => {
			const ren: NavbarRenderableReference = { name: value.title, url: `/wc/post/${value.name}`, extra: []};

			//Can't be undefined here, but just to make the compiler happy
			ren.extra?.push(value.data.explorer.description);

			return ren;
		})
	);
	catsMap.set("reviews", []);

	return isMobile ? (
		<MobileAppNavbar categories={catsMap} />
	) : (
		<DesktopAppNavbar categories={catsMap} />
	);
}

export interface AppNavbarImplProps {
	categories: Map<string, object[]>;
}
