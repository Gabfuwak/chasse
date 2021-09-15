import { GetServerSideProps } from "next";

import Cookies from "cookies";
import Keygrip from "keygrip";
import CryptoJs from "crypto-js";

export default function Page() {
	return <h1>Wow congrats you managed to unlock the first step !</h1>;
}


export const getServerSideProps: GetServerSideProps = async (context) => {

	let keys = Keygrip([process.env.REACT_APP_COOKIE_KEYS || ""]);
	const cookies = new Cookies(context.req, context.res, { keys: keys });

	let url: string = context.resolvedUrl;

	let decoded = "decoded/";

	let finallyShouldFail = true;

	try {
		url = url.substring(url.indexOf(decoded) + decoded.length);

		const hash_or_undef = cookies.get(url, { signed: true });

		if (hash_or_undef === undefined) {
			return {
				notFound: true
			}
			/*
			return {
				redirect: {
					//FIXME: honestly ? I don't even know
					destination: process.env.REACT_APP_CRITICAL_CRASH_URL!, //! notice the '!' at the end ; it means this value shouldn't logically be null. So remember to have it in the env
					permanent: false,

					//I do know why I did this.
					//Normal 'notFound: true' didn't work,
					//It showed an error on the 404 page.
					//So I though maybe I could redirect to
					//a page that will 404 normally.
					//So I just kinda did that.
					//Worst part is it works.
				},
			};
			*/
		}

		//Basically just read the correct cookie,
		//decrypt the value, if it corresponds then
		//voila it's correct

		const hash: string = hash_or_undef;

		const bytes = CryptoJs.AES.decrypt(
			hash,
			process.env.REACT_APP_URL_ENCRYPT_PASSPHRASE || ""
		);
		decoded = bytes.toString(CryptoJs.enc.Utf8);

		if (decoded === url) {
			finallyShouldFail = false;
			return {
				props: {}
			};
		}

	} catch (error) {
		console.error(error);
	} finally {
		if(finallyShouldFail){
			return {
				notFound: true,
			};
		}
		else {
			return {
				props: {}
			};
		}
	}
}
