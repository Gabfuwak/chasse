

export function roundReadingTime(time: number) {
	if (time < 0.8) {
		time = 0;
	} else {
		time = Math.ceil(time);
	}

	return time;
}

export function extractHTMLText(htmlString: string) {
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