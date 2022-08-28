import Head from 'next/head'
import NoMatch from '../components/NoMatch'

export default function NotFound({config,locale,...pageProps}) {
  return (
    <>
      <Head>
        <title>{config.nomatchTitle+config.masterTitle}</title>
        <meta name="description" content={config.nomatchTitle} />
        <meta property="og:title" content={404} />
        <meta property="og:description" content={config.nomatchTitle} />
      </Head>
      <NoMatch config={config} locale={locale} {...pageProps} />
    </>
  )
}
// export const getStaticProps = () => {
//   return {
//     redirect: {
//       destination: '/404',
//       permanent: true,
//     },
//   };
// };