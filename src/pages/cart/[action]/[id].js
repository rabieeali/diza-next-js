import Head from 'next/head'
import { CartSuccess,CartFaild } from '@/components/Cart';
import {useRouter} from 'next/router'
import translate from '../../../config/translate'
  
export default function CartAction({locale,redirect,config,...pageProps}) {
    const iprops=translate[locale];
    const router=useRouter()
    const {action,id}=router.query
    let title,description,Block
    if(action=='faild'){Block=CartFaild;title=iprops.cartFaild.title;description=iprops.cartFaild.description}else if(action=='success'){Block=CartSuccess;title=iprops.cartSuccess.title;description=iprops.cartSuccess.description}else{redirect('/404')}
    return (
        <>
        <Head>
            <title>{title+config.masterTitle}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
        </Head>
        <Block id={id} action={action} config={config} locale={locale} redirect={redirect} />
        </>
    )
}

