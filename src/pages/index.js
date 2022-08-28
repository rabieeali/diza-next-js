import Head from 'next/head'
import Image from 'next/image'
import Home from '../components/Home';

export default function hiHome({config,...pageProps}) {
  return (
    <>
      <Head>
        <title>{config.indexTitle}</title>
        <meta name="description" content={config.indexDescripion} />
        <meta property="og:title" content={config.indexTitle} />
        <meta property="og:description" content={config.indexDescripion} />
      </Head>
      <Home config={config} {...pageProps} />
    </>
  )
}

// import styles from '../styles/Home.module.css'
// import ArticleList from '../components/ArticleList'
// import {server} from '../config'
// import axios from '../config/axios'

// export const getStaticProps = async (context) => {
//   // console.log(context);
//   // const response = await axios.get('/articles');
//   const response = await fetch(`${server}/articles`)
//   const articles = await response.json()
//   // const articles = response.data.data;
//   // const response = await fetch(`${server}/api/articles`)
//   // const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6')
//   // const articles = await response.json()
//   return {
//     props: {articles}
//   }
// }