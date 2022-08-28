import Head from 'next/head'
import { Designers } from '@/components/Designers';
  
export default function hiDesigners({config,designers,meta,...pageProps}) {
    return (
        <>
        <Head>
            <title>{config.designersTitle+config.masterTitle}</title>
            <meta name="description" content={config.designersDescription} />
            <meta property="og:title" content={config.designersTitle} />
            <meta property="og:description" content={config.designersDescription} />
        </Head>
        <Designers designers={designers} config={config} {...pageProps}/>
        </>
    )
}