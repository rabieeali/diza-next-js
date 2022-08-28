import { postFetch } from '@/lib/postData';
import Head from 'next/head'
import { useRouter } from 'next/router';
import Categories from '../../components/Categories';
import translate from '@/config/translate';  
  
export default function Products({meta,redirect,config,...pageProps}) {
    const router = useRouter();
    const decodeUrl=(str)=>{return str.replace(/-/g, ' ')}
    const capitalizeFirstLetter = (string) => { return string.charAt(0).toUpperCase() + string.slice(1); }
    const { locale } = router
    const iprops=translate[locale]
    const { discount, slug, sort } = router.query
    let title=iprops.products,description=null,sex,nav,navtitle,term;
    if(discount && discount!='false' && locale!='en'){ title+=' '+iprops.discounted }else if(discount && discount!='false' && locale=='en'){ title=iprops.discounted+' '+title}
    if(sort){
        if(sort=='lowest-price'){title=iprops.economical+' '+title}
        if(sort=='most-popular'){title=iprops.popular+' '+title}
        if(sort=='highest-price'){title=iprops.expensive+' '+title}
        if(sort=='the-newest'){title=iprops.latest+' '+title}
    }
    if(meta){ title=meta.title;description=meta.description }
    return (
        <>
        <Head>
            <title>{title+config.masterTitle}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
        </Head>
        <Categories title={title} redirect={redirect} navList={pageProps.navList} config={config} {...pageProps}/>
        </>
    )
}