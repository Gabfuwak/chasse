import e from "cors";
import { parse } from "path";

import TOML from '@tauri-apps/toml';


interface ParsedFrontMatter {
	data: object;
	content: string;
}

export function parseFrontMatter(input: string) {
	const delimiter = "+++";

	const end = input.indexOf(delimiter, delimiter.length);

	if (end !== -1) {
		const toParse = input.substring(delimiter.length, end);
		const parsed = TOML.parse(toParse);

		//+1 Because of the first line feed
		const content = input.substring(end + delimiter.length + 1);

		return { data: parsed, content };
	} else {
		const content = input;
		return { data: {}, content };
	}
}







//! Keeping the attempt PSOL for historical reasons
//! Right now I'll be using TOML for front-matter

// /**
//  * Pretty Simple Object Language
//  * 
//  * The basics of the language are:
//  * - key: value
//  * - EOL marks the end of a declaration
//  * - an object is delimited by curly brackets
//  * - an array is delimited by square brackets
//  * - indentation is purely visual
//  * 
//  * An example:
//  * '''PSOL
//  * name: Deborah
//  * age: 23
//  * location: {
//  *      city: New York
//  *      address: 6 pottery road
//  * }
//  * interests: [
//  *      none
//         undefined
//         pottery
//  * ]
//  * '''
//  */
// namespace PSOL {
// 	interface ParsedObject {
// 		[key: string]: any;
// 	}

// 	/**
// 	 * Parses a string of *correct* PSOL and returns an object.
// 	 * Behavior is undefined if incorrect PSOL is fed
// 	 * @param input a string of PSOL text
// 	 */
// 	export function parse(input: string): ParsedObject {
// 		let result: ParsedObject = {};

// 		/**
// 		 * Variable that contains the '['s, in order (FILO, so a pile, hence the name)
// 		 * A character is to be removed when the matching character is found (']' for '[' for example)
// 		 */
// 		let pile = "";

// 		/**
// 		 * Variable used to contain the most recently parsed key
// 		 */
// 		let keyMemory = "";
// 		/**
// 		 * Variable used to contain the thing we're currently parsing
// 		 */
// 		let buildingMemory = "";

// 		const addToPile = (char: string) => {
// 			if (
// 				pile.length > 0 &&
// 				char === "}" &&
// 				pile[pile.length - 1] === "{"
// 			) {
// 				pile = pile.slice(0, pile.length - 1);
// 			} else {
// 				pile += char;
// 			}
// 		};

// 		const read = (char: string) => {
// 			buildingMemory += char;
// 		};

// 		const addKV = (key: string, value: any) => {
// 			result[key] = value;
// 		};

// 		const endReading = () => {
// 			if (keyMemory === "") {
// 				keyMemory = buildingMemory;
// 				buildingMemory = "";
// 			} else {
// 				addKV(keyMemory, parseBasicValue(buildingMemory));
// 				buildingMemory = "";
// 				keyMemory = "";
// 			}
// 		};

// 		for (let i = 0; i < input.length; i++) {
// 			const char = input[i];

// 			switch (String(char)) {
// 				case "{":
// 					let closingCurly = findMatching(input.substring(i+1), '{', '}');
// 					if(closingCurly != -1){
// 						addKV(keyMemory, parse(input.substring(i+1, closingCurly)));
// 						keyMemory = '';
// 						buildingMemory = '';
// 						i = closingCurly;
// 					}
// 					break;
// 				case "[":
// 					let closingBracket = findMatching(input.substring(i+1), '[', ']');
// 					if(closingBracket != -1){
// 						addKV(keyMemory, parseArray(input.substring(i+1, closingBracket)));
// 						keyMemory = '';
// 						buildingMemory = '';
// 						i = closingBracket;
// 					}
// 				case "\n":
// 					if(buildingMemory){
// 						endReading();
// 					}
// 					else {
// 						//Wipe it just to be safe
// 						keyMemory = '';
// 					}
// 					break;
// 				default:
// 					read(char);
// 					endReading();
// 					break;
// 			}
// 		}

// 		return result;
// 	}

// 	function findMatching(input: string, inChar: string, match: string) {
// 		let depth = 0;
// 		let j;
// 		for (j = 0; j < input.length; j++) {
// 			const char = input[j];
// 			if (char === match) {
// 				depth--;
// 			}
// 			if (depth == 0) {
// 				break;
// 			}
// 			if (char === inChar) {
// 				depth++;
// 			}
// 		}
// 		if (depth == 0) {
// 			return j;
// 		} else {
// 			//TODO: errors
// 			return -1;
// 		}
// 	}

// 	function parseArray(input: string) {
// 		let result: any[] = [];

// 		let memory = '';

// 		for (let i = 0; i < input.length; i++) {
// 			const char = input[i];
// 			switch(String(char)){
// 				case '[':
// 					let closingBracket = findMatching(input.substring(i+1), '[', ']');
// 					if(closingBracket != -1){
// 						result.push(parseArray(input.substring(i+1, closingBracket)));
// 						memory = '';
// 						i = closingBracket;
// 					}
// 					break;
// 				case '{':
// 					let closingCurly = findMatching(input.substring(i+1), '{', '}');
// 					if(closingCurly != -1){
// 						result.push(parse(input.substring(i+1, closingCurly)));
// 						memory = '';
// 						i = closingCurly;
// 					}
// 					break;
// 				case '\n':
// 					if(memory){
// 						result.push(parseBasicValue(memory));
// 					}
// 					memory = '';
// 					break;
// 				default:
// 					memory += char;
// 					break;
// 			}
// 		}
// 	}

// 	function parseBasicValue(input: string) {
// 		if (input === "") {
// 			return undefined;
// 		}

// 		let isTrue;
// 		if ((isTrue = input === "true") || input === "false") {
// 			return isTrue;
// 		}

// 		let isNum = true;
// 		for (const char of input) {
// 			switch (String(char)) {
// 				case "1":
// 				case "2":
// 				case "3":
// 				case "4":
// 				case "5":
// 				case "6":
// 				case "7":
// 				case "8":
// 				case "9":
// 				case "0":
// 					continue;
// 				default:
// 					isNum = false;
// 			}
// 		}

// 		if (isNum) {
// 			return +input;
// 		}

// 		//Must be just a string
// 		return input;
// 	}
// }

// console.log(
// 	JSON.stringify(
// 		PSOL.parse(`
// Name: Delilah
// Age: 26
// hobbies: [
//     fingerpainting
//     drawing
// ]
// blonde: true
// `),
// 		null,
// 		4
// 	)
// );

// console.log(
// 	JSON.stringify(
// 		PSOL.parse(`
// title: lists
// content: [
//     [
//         burgers
//         fries
//     ]
//     [
//         large coke
//         pespi
//     ]
//     heeheeburger
// ]
// `),
// 		null,
// 		4
// 	)
// );
