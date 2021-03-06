import Head from 'next/head';
import Link from 'next/link';
import styles from '@styles/p/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Omega Scrabble</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Epic projet 
        </h1>

        
        
        <Link href={"/wc/post/first-post"}>Link to actual hint</Link>
      </main>
    </div>
  );
};

//{/* 
//          To test out an incorrect link, look at the structure of the correct one and modify the code= a bit, or remove it entirely
//          The only problem is that we can't link to an incorrect /qr page internally but it doesn't actually matter because 
//          we aren't gonna do that. 
//        */}
//
//        <Link href={"/hunt/qr?code=U2FsdGVkX1/v6klt/R+o0+kS3/6NIFvGQfQV/B0ritc="}>Link that works</Link>
//
//        <h1>And also</h1>
