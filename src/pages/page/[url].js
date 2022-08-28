import Page from '@/components/Page'
import Head from 'next/head'
import { useRouter } from 'next/router'
import {postData} from '../../lib/postData'
import store from '../../redux/store'


export default function HiPage({pages,redirect,config,...pageProps}) {
    const router = useRouter()
    const paig=pages.map(i=> { return i.url==router.query.url && i })
    if(!paig[0]){redirect('/404');return(<span>w8</span>)}else{
      const page = paig[0]
      return (
        <>
        <Head>
            <title>{page.title+config.masterTitle}</title>
            <meta name="description" content={page.description} />
            <meta property="og:title" content={page.title} />
            <meta property="og:description" content={page.description} />
        </Head>
        <Page url={router.query.url} sql={page}></Page>
        {/* <Designer sql={sql} products={products} url={url} designers={designers} config={config} coupons={coupons} {...pageProps} /> */}
        </>
      )
  }
}