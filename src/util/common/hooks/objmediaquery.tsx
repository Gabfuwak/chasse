//import {useMediaQuery} from '@react-hook/media-query'
import json2mq from "json2mq";
import { useState, useEffect } from "react";


//https://fireship.io/snippets/use-media-query-hook/
//because package '@react-hook/media-query' didn't work
const useMediaQuery = (query: string) => {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const media = window.matchMedia(query);
		if (media.matches !== matches) {
			setMatches(media.matches);
		}
		const listener = () => setMatches(media.matches);
		window.addEventListener("resize", listener);
		return () => window.removeEventListener("resize", listener);
	}, [matches, query]);

	return matches;
};

/**
 * Tiny hook so we don't have to call json2mq every time while still
 * using it.
 * @see useMediaQuery from package \@react-hook/media-query
 * @param object
 * @returns
 */
export default function useObjectMediaQuery(...object: json2mq.QueryObject[]) {
	return useMediaQuery(json2mq(object));
}

export function useIsMobileMQ() {
	return useObjectMediaQuery(
		{
			screen: true,
			maxAspectRatio: "19/20",
		},
		{
			screen: true,
			maxWidth: "60ch",
		}
	);
}