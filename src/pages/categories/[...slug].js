import { postFetch } from '@/lib/postData';
import Head from 'next/head'
import { useRouter } from 'next/router';
import Categories from '../../components/Categories';
import translate from '@/config/translate';  

export default function Products({meta,redirect,config,coupons,...pageProps}) {
    const decodeUrl=(str)=>{return str.replace(/-/g, ' ')}
    const capitalizeFirstLetter = (string) => { return string.charAt(0).toUpperCase() + string.slice(1); }
    const router = useRouter();
    const {locale} = router
    const iprops=translate[locale]
    const { discount, slug, sort } = router.query
    let title=iprops.categories,description=null,sex,nav,navtitle,term;
    slug.map((value,slukey)=>{
        value=decodeURIComponent(value)
        switch(slukey){
            case 0: sex=value; break;
            case 1: nav=value; break;
            case 2: navtitle=value; break;
        }
    })
    if(!nav){
        if(locale=='en'){ title=capitalizeFirstLetter(decodeUrl(sex))+"'s "+decodeUrl(iprops.products) }else{ title=iprops.products+' '+decodeUrl(sex) }
    }else{
        if(navtitle){
            if(locale=='en'){ title=capitalizeFirstLetter(decodeUrl(sex))+"'s "+decodeUrl(navtitle) }
            else if(locale=='fa'){ title=decodeUrl(navtitle)+' های '+decodeUrl(sex) }
            else{ title=decodeUrl(navtitle)+' '+decodeUrl(sex) }
        }else{
            if(locale=='en'){ title=capitalizeFirstLetter(decodeUrl(sex))+"'s "+decodeUrl(nav) }
            else if(locale=='fa'){ title=decodeUrl(nav)+' '+decodeUrl(sex) }
            else{ title=decodeUrl(nav)+' '+decodeUrl(sex) }
        }
    }
    if(discount && discount!='false' && locale!='en'){ title+=' '+iprops.discounted }else if(discount && discount!='false' && locale=='en'){ title=iprops.discounted+' '+title}
    if(sort){
        if(sort=='lowest-price'){title=iprops.economical+' '+title}
        if(sort=='most-popular'){title=iprops.popular+' '+title}
        if(sort=='highest-price'){title=iprops.expensive+' '+title}
        if(sort=='the-newest'){title=iprops.latest+' '+title}
    }
    if(meta){ title=meta.title;description=meta.description }
    // const {senser,productsets,coupons,lastvisits,err} = dupaDoua()
    return (
        <>
        <Head>
            <title>{title+config.masterTitle}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
        </Head>
        <Categories title={title} locale={locale} redirect={redirect} coupons={coupons} navList={pageProps.navList} config={config} {...pageProps}/>
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
// export const getStaticProps = async ({ params }) => {
//     // return {props:{coupons: [8]}}
//     return {props:{params}}
//     console.log(context,'hooy ba toaamm')
// }

// export async function getStaticProps(context) {

//     return {
//       props: {
//        context: context
//       },
//     };
//   }

// export async function getStaticProps(context) {

//     return {
//       props: {
//        context: context
//       },
//     };
//   }
  
// //   export async function getStaticPaths() {
// //     return {
// //       paths: [{ params: { product: "1" } }, { params: { product: "2" } }],
// //       fallback: true,
// //     };
// //   }
// export const getStaticPaths = async () => {
//     return {
//         paths: [
//         //   '/categories/[slug]',
//           '/categories/[sex]',
//           '/categories/[sex]/[nav]',
//           '/categories/[sex]/[nav]/[title]',
//         ],
//         fallback: true,
//     }
// }

// export const getServerSideProps = async (context) => {
//     let seo=[],currentUrl=context.resolvedUrl;
//     // if (typeof window !== "undefined") {
//     // currentUrl = window.location.pathname;
    

//     // }
//     // console.log(currentUrl,'currentUrl');
//     // console.log(context);
//     // const response = await axios.get('/articles');
//     const response = await fetch(`${server}/articles`)
//     // const seo = await response.json()
//     seo = 7
//     // const articles = response.data.data;
//     // const response = await fetch(`${server}/api/articles`)
//     // const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6')
//     // const articles = await response.json()
//     console.log(context,'ccc')
//     return {
//       props: {seo}
//     }
//   }