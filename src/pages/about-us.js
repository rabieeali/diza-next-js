import Head from 'next/head'
import Router from 'next/router';
import About from '../components/About';
import { useEffect } from 'react';

export default function AboutUs({redirect,locale,config,...pageProps}) {
  return (
    <>
      <Head>
        <title>{config.aboutTitle+config.masterTitle}</title>
        <meta name="description" content={config.aboutDescripion} />
        <meta property="og:title" content={config.aboutTitle} />
        <meta property="og:description" content={config.aboutDescripion} />
      </Head>
      <About redirect={redirect} locale={locale} config={config} {...pageProps}/>
    </>
  )
}
