import Head from 'next/head'
import Contact from '../../components/Contact';
import MyApp from 'next/app'

export default function hiContact({config,locale,...pageProps}) {
  return (
    <>
    
      <Head>
        <title>{config.contactTitle+config.masterTitle}</title>
        <meta name="description" content={config.contactDescripion} />
        <meta property="og:title" content={config.contactTitle} />
        <meta property="og:description" content={config.contactDescripion} />
      </Head>
      <Contact locale={locale} config={config} {...pageProps}/>
    </>
  )
}

export async function getInitialProps(context){
    const pageProps = await MyApp.getInitialProps(context)
    return {
      ...pageProps,
     }
}