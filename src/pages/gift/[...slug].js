import Gift from '@/components/Gift';
import translate from '@/config/translate';
import { postFetch } from '@/lib/postData';
import Head from 'next/head'
import { useRouter } from 'next/router';
import {server} from '../../config'
  
export default function HiGift({locale,redirect,config,...pageProps}) {
    const iprops=translate[locale]
    let title=iprops.giftcard
    const description=null;
    const router = useRouter(), {slug} = router.query
    let log,id
    if(slug.length>1){ log=slug[0];id=slug[1]}else if(slug && slug[0]!='cards'){ id=slug[0] }
    if(!log && id && id!='faild'){  }
    if(log=='faild'){title=iprops.faildpurchase}
    const offlinegifts=[]
    console.log(router,slug,'id:'+id,'log:'+log);
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return (
        <>
        <Head>
            <title>{capitalizeFirstLetter(title)+config.masterTitle}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={capitalizeFirstLetter(title)} />
            <meta property="og:description" content={description} />
        </Head>
        <Gift log={log} id={id} locale={locale} offlinegifts={offlinegifts} config={config} {...pageProps}/>
        </>
    )
}
// productTitle(){
//     const {nav,parent,title,sex,term} = this.props.match.params;
//     let pretitle='';
//     // let discount=new URLSearchParams(this.props.location.search).get("discount");
//     // if(discount && discount=='true'){
//     //     pretitle=' تخفیف‌دار';
//     // }
//     if(this.state.onlydiscount){pretitle=' تخفیف‌دار';}
//     let decodeUrl=(str)=>{return str.replace(/-/g, ' ')}
//     if(!nav){
//         if(term){this.setState({'title':'جستجو برای "'+decodeUrl(term)+'"'+pretitle});}else{this.setState({'title':'محصولات '+sex+pretitle});if(!sex){this.setState({'title':'تمامی محصولات'+pretitle});}}
//     }else{
//         if(title){this.setState({'title':decodeUrl(title)+pretitle});}else if(parent){this.setState({'title':decodeUrl(parent)+pretitle});}else{this.setState({'title':decodeUrl(nav)+pretitle});}
//     }
// }
export const getServerSideProps = async (context) => {
    let seo=[],currentUrl=context.resolvedUrl;
    // if (typeof window !== "undefined") {
    // currentUrl = window.location.pathname;
    

    // }
    // console.log(currentUrl,'currentUrl');
    // console.log(context);
    // const response = await axios.get('/articles');
    const response = await fetch(`${server}/articles`)
    // const seo = await response.json()
    seo = 7
    // const articles = response.data.data;
    // const response = await fetch(`${server}/api/articles`)
    // const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6')
    // const articles = await response.json()
    console.log(context,'ccc')
    return {
      props: {seo}
    }
  }