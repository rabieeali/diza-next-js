import Head from 'next/head'
import Product from '@/components/Product';
import { useEffect,useState } from 'react';
import {postData} from '@/lib/postData';
import translate from '@/config/translate';
import Cart from '@/components/Cart';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
  
export default function HiCart({designers,coupons,redirect,locale,config,...pageProps}) {
    const iprops=translate[locale]
    const title=iprops.cart.title;
    return (
        <>
        <Head>
            <title>{title+config.masterTitle}</title>
            <meta property="og:title" content={title} />
        </Head>
        <Cart iprops={iprops} locale={locale} config={config} {...pageProps} coupons={coupons} designers={designers}/>
        </>
    )
}

