import Designer from '@/components/Designers'
import Head from 'next/head'
import { useRouter } from 'next/router'
import {postData} from '../../lib/postData'
  
export default function HiDesigner({sql,products,redirect,config,coupons,designers,meta,...pageProps}) {
    const router = useRouter()
    let url=router.query['@...url'];
  	if(!url.includes('@')){redirect('/404');return(<span>w8</span>)}
  	url=url.replace('@','')
    const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return (
        <>
        <Head>
            <title>{capitalizeFirstLetter(sql.name)+config.masterTitle}</title>
            <meta name="description" content={sql.description} />
            <meta property="og:title" content={capitalizeFirstLetter(sql.name)} />
            <meta property="og:description" content={sql.description} />
        </Head>
        <Designer redirect={redirect} sql={sql} products={products} url={url} designers={designers} config={config} coupons={coupons} {...pageProps} />
        </>
    )
}

export const getServerSideProps = async (context) => {
  console.log(context,'...');
  let url=context.query['@...url'];
  const {locale}=context
	if(!url.includes('@')){
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props:{},
    };
  }
	url=url.replace('@','')
  const call = await postData('designer/'+url,{locale},true,false)
  const {status,sql,products} = call
  if(status!="200"){
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props:{},
    };
  }
  return {
    props:{
    sql:sql,
    products:products
    }
  }
}