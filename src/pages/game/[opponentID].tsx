import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

function Game() {
    const router = useRouter()
    const { opponentID } = router.query

    return (
        <Fragment>
            <Head>
                <title>ID : {opponentID}</title>
            </Head>
            <p>
                opponentID: {opponentID}
            </p>
        </Fragment>
    )
}

export default Game