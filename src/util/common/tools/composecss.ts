
type possibleCssType = string | undefined | null | false;

/**
 * Function that takes in multiple css module classnames and mixes them into a single string
 * If you put a non truthy value in the array it will not be added !
 * @param styles an array of css module styles (others (raw classnames) accepted !)
 * @returns a single string containing all the styling.
 */
export default function compose(...styles: possibleCssType[]) {
    let result = '';

    for(let style of styles) {
        if(style) result += style + ' ';
    }

    return result;
}