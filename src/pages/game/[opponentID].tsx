import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

export default function Game() {
    const router = useRouter();
    const { opponentID } = router.query;

    const debug = true;

    return (
        <Fragment>
            <Head>
                <title>ID : {opponentID}</title>
            </Head>
            {
                debug ? 
                <p>Debug renderer not implemented yet :/</p> : // RawHTMLScrabbleRenderer
                <p>Error : non-debug mode not defined</p>
            }
        </Fragment>
    );
}

