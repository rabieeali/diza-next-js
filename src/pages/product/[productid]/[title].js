import Head from 'next/head'
import Product from '@/components/Product';
import { useEffect,useState } from 'react';
import Router,{ useRouter } from 'next/router'
import {postData} from '../../../lib/postData'
import translate from '@/config/translate';  

export default function hiProduct({sql,locale,senser,productsets,coupons,redirect,designers,config,...pageProps}) {
  const capitalizeFirstLetter = (string) => { return string.charAt(0).toUpperCase() + string.slice(1); }
  const iprops=translate[locale]
  const title=capitalizeFirstLetter(iprops.producseo1 + sql.title + iprops.producseo2 + sql.designer + iprops.producseo3);
    // const title=productTitle()
    // const {senser,productsets,coupons,lastvisits,err} = dupaDoua()
    // console.log('this is not dupadoua',{senser,productsets,coupons,lastvisits,err})
    return (
        <>
        <Head>
            <title>{title+config.masterTitle}</title>
            <meta name="description" content={sql.description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={sql.description} />
        </Head>
        <Product sql={sql} locale={locale} senser={senser} coupons={coupons} productset={productsets} redirect={redirect} designers={designers} config={config} {...pageProps}></Product>
        {/* tags={this.state.tags}
        designers={this.state.designers}
        lastvisits={this.state.lastvisits}
        productsdeluxe={this.state.productsdeluxe}
        products={this.state.products}
        productset={this.state.productset}
        config={this.state.config}
        senser={this.state.senser}
        coupons={this.state.coupons} */}
        </>
    )
}




// export default function hiDesigner({sql,products,redirect,config,coupons,designers,meta,...pageProps}) {
//     const router = useRouter()
//     let url=router.query['@...url'];
//   	if(!url.includes('@')){redirect('/404');return(<span>w8</span>)}
//   	url=url.replace('@','')
//     const capitalizeFirstLetter = (string) => {
//       return string.charAt(0).toUpperCase() + string.slice(1);
//     }
//     return (
//         <>
//         <Head>
//             <title>{capitalizeFirstLetter(sql.name)+config.masterTitle}</title>
//             <meta name="description" content={sql.description} />
//             <meta property="og:title" content={capitalizeFirstLetter(sql.name)} />
//             <meta property="og:description" content={sql.description} />
//         </Head>
//         <Designer sql={sql} products={products} url={url} designers={designers} config={config} coupons={coupons} {...pageProps} />
//         </>
//     )
// }

export const getServerSideProps = async (context) => {
    const {locale}=context
    const {title,productid}=context.query
    const sql = await postData('product/'+productid,{locale},true)
    if(sql==404){
      return {
        redirect: {
          permanent: false,
          destination: `${locale!='fa' ? '/'+locale : ''}/404`,
        },
        props:{},
      };
    }
    
// 	url=url.replace('@','')
//   const {status,sql,products} = call
//   if(status!="200"){
//     return {
//       redirect: {
//         permanent: false,
//         destination: "/404",
//       },
//       props:{},
//     };
//   }
  return {
    props:{
    sql:sql,
    // products:products
    }
  }
}




// let userId='null';
//         let userphone='null';
//         $('body').addClass('loading');
//         if(localStorage.getItem('userData')){
//             let userData=localStorage.getItem('userData');
//             this.setState({'isLogined':true});
//             this.setState({'userData':userData});
//             this.setState({'userName':JSON.parse(userData).fullname});
//             this.setState({'userPhone':JSON.parse(userData).userphone});
//             userId=JSON.parse(userData).id;
//             userphone=JSON.parse(userData).userphone;
//         }
//         $('header,nav').addClass('minimize');
//         this.setState({sql:[],title:'محصول'});
//         const {productid,title} = this.props.router.query;
//         let self=this,color='default';
//         let encodeUrl=(str)=>{return str.replace(/ /g,'-')}
//         if(window.location.hash){color=window.location.hash.substring(1);}
//         postData('product/'+productid,{color:color,userphone:userphone,userid:userId},true).then(response=>{
//             if(response=='404'){
//                 self.setState({redirect:true});
//                 return false;
//             }