import Head from 'next/head'
import Categories from '../../../components/Categories';
import { useRouter } from 'next/router';
import translate from '@/config/translate';
  
export default function HiSearch({locale,config,meta,...pageProps}) {
    const router = useRouter();
    // const {locale} = router
    const iprops=translate[locale]
    const decodeUrl=(str)=>{return str.replace(/-/g, ' ')}, { term, discount } = router.query
    const capitalizeFirstLetter = (string) => { return string.charAt(0).toUpperCase() + string.slice(1); }
    let title = '"'+term+'"',description
    if(discount && discount!='false' && locale!='en'){ title+=' '+iprops.discounted }else if(discount && discount!='false' && locale=='en'){ title=iprops.discounted+' '+title}
    title=capitalizeFirstLetter(iprops.searchfor)+' '+title
    if(meta){ title=meta.title;description=meta.description }
    return (
        <>
        <Head>
            <title>{title+config.masterTitle}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
        </Head>
        <Categories locale={locale} navList={pageProps.navList} config={config} {...pageProps}/>
        </>
    )
}