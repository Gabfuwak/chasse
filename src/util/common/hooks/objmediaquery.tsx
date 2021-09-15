import {useMediaQuery} from '@react-hook/media-query'
import json2mq from "json2mq";

/**
 * Tiny hook so we don't have to call json2mq every time while still
 * using it.
 * @see useMediaQuery from package \@react-hook/media-query
 * @param object 
 * @returns 
 */
export default function useObjectMediaQuery(object: json2mq.QueryObject | json2mq.QueryObject[]) {
    return useMediaQuery(json2mq(object));
}