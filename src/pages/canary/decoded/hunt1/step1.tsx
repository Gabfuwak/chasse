import { GetServerSideProps } from "next";

import Cookies from "cookies";
import Keygrip from "keygrip";
import CryptoJs from "crypto-js";

export default function Page() {
	return <h1>Wow congrats you managed to unlock the first step !</h1>;
}

export async function getServerSideProps(context: GetServerSideProps) {
    //If you see any typescript error like 'context doesn't have a 'req' attribute'
    //Just ignore it I don't know what's wrong with these but it works just fine
    //The errors are lying


	let keys = Keygrip([process.env.REACT_APP_COOKIE_KEYS || ""]);
	const cookies = new Cookies(context.req, context.res, { keys: keys });

	let url: string = context.resolvedUrl;

	let decoded = "decoded/";

	try {
		url = url.substring(url.indexOf(decoded) + decoded.length);

		const hash_or_undef = cookies.get(url, { signed: true });

		if (hash_or_undef === undefined) {
			return {
				redirect: { 
                    //FIXME: honestly ? I don't even know
					destination: process.env.REACT_APP_CRITICAL_CRASH_URL,
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
			return {
				props: {},
			};
		}
	} catch (error) {
		console.error(error);
	}

	//It shouldn't ever get to this point
	//Because this will show an error in the error page
	//(error combo except we only planned for one to happen)
	//And displaying your errors to end users isn't good practice
	return {
		notFound: true,
	};
}
