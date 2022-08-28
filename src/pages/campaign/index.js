import Campaign from '@/components/Campaign';
import Gift from '@/components/Gift';
import Head from 'next/head'
  
export default function GiftCards({config,...pageProps}) {
    return (
        <>
        <Head>
            <title>{'لندینگ'+config.masterTitle}</title>
        </Head>
        <Campaign config={config} {...pageProps}/>
        </>
    )
}