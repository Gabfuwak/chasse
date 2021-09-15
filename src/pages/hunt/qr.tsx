//References
// See  - https://sergiodxa.com/articles/redirects-in-next-the-good-way
// Also - https://maxschmitt.me/posts/next-js-cookies/

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

import CryptoJs from "crypto-js";
import Cookies from "cookies";
import Keygrip from "keygrip";

export default function QRPage() {
	const router = useRouter();
	const [countdown, setCountdown] = useState(4);

	useEffect(() => {
		if (countdown > 0) {
			setTimeout(() => {
				setCountdown(countdown - 1);
			}, 1000);
		} else {
			router.replace("decoded/hunt1/step1");
		}
	}, [countdown, router]);

	return (
		<main>
			<h1>You have validated this hint !</h1>
			<h2>Your progress has been saved. Everything is fine</h2>

			<h3>You will be redirected to the hint in</h3>
			<p>{countdown}</p>
		</main>
	);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	let decoded = "";

	let { code } = context.query;
	let qr_id = code;

	if (!qr_id || qr_id === undefined) {
		return {
			notFound: true
		};
	}

	if (Array.isArray(qr_id)) {
		qr_id = qr_id[0];
	}

	//This has got to be the single worst thing I have ever done
	//For some reason, it's refusing 'replaceAll' as a valid function
	//EVEN THOUGH THAT'S LITERALLY THE FUNCTION FOR THIS
	//So I have to do this. I only have a single question for god. Why ?
	while (qr_id !== (qr_id = qr_id.replace(" ", "+"))) {
		continue;
	}

	try {
		let should_return = false;

		try {
			const bytes = CryptoJs.AES.decrypt(
				qr_id,
				process.env.REACT_APP_URL_ENCRYPT_PASSPHRASE || ""
			);
			decoded = bytes.toString(CryptoJs.enc.Utf8);

			if(decoded === "") {
				throw Error('Incorrect AES input data');
			}
		} catch (error) {
			return {notFound: true}
		}

		//Set a signed cookie that lasts like 10 years
		let keys = Keygrip([process.env.REACT_APP_COOKIE_KEYS || ""]);
		const cookies = new Cookies(context.req, context.res, { keys: keys });
		cookies.set(decoded, qr_id, {
			signed: true,
			maxAge: 1000 * 3600 * 24 * 31 * 12 * 10,
		});

		return {
			props: {},
		};
	} catch (error) {
		console.error(error);

		return {
			notFound: true,
			/*
			redirect: {
				//FIXME: see hunt1/step1.tsx
				destination: process.env.REACT_APP_CRITICAL_CRASH_URL,
				permanent: false,
			},
			*/
		};
	}
}
