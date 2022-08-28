import Head from 'next/head'
import Overview from '../../components/Overview';
import MyApp from 'next/app'

export default function hiOverview({config,designers,navList,locale,...pageProps}) {
  return (
    <>
      <Head>
        <title>{config.indexTitle}</title>
      </Head>
      <Overview designers={designers} navList={navList} locale={locale} config={config} {...pageProps} />
    </>
  )
}

export async function getInitialProps(context){
    const pageProps = await MyApp.getInitialProps(context)
    return {
      ...pageProps,
     }
}