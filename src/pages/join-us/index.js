import Head from 'next/head'
import JoinUs from '@/components/JoinUs';
import translate from '@/config/translate';

export default function hiJoinUs({redirect,locale,config,...pageProps}) {
const capitalizeFirstLetter = (string) => { return string.charAt(0).toUpperCase() + string.slice(1); }
const iprops=translate[locale]
const title=capitalizeFirstLetter(iprops.joinus.title);
const description=capitalizeFirstLetter(iprops.joinus.description);
return (
    <>
      <Head>
        <title>{title+config.masterTitle}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
      <JoinUs locale={locale} {...pageProps} />
    </>
  )
}