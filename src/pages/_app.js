import '../styles/globals.scss'
import { server } from '../config'
import { useEffect, useState } from 'react'
import Layout from '../components/Master'
import Router, { useRouter } from 'next/router'
import { Provider } from 'react-redux'
import { createWrapper } from 'next-redux-wrapper';
import store from '../redux/store'
import { setInit, setDoua, laravelize } from '../redux/actions/initAction'
import { getFetch } from '../lib/dataApi'
import Axios from '../lib/axios'
import { postFetch } from '@/lib/postData';
const crsf = async () => {
  await Axios.get(server+'/sanctum/csrf-cookie')
}
const APPLICATION = ({ Component, pageProps, props }) => {
  const [loading,setprogress] = useState(7)
  const [tokenize,setToken] = useState(false)
  const [dopamine,setDopa] = useState(false)
  Router.events.on('routeChangeStart', url => setprogress(true))
  Router.events.on('routeChangeComplete', () => setprogress(false))
  Router.events.on('routeChangeError', () => console.log('error 405 o_o'))
  const REDIRECT = async (url) => {
    if(!loading){
    setprogress(true)
    await Router.push(url)
    }
  }
  const { config,navList,pages,coupons,productsets,senser,designers,locale } = props
  const dev = process.env.NODE_ENV !== 'production'
  useEffect(()=>{
    if(!tokenize || !store.getState().root.config){
      crsf()
      store.dispatch(setInit(locale,{locale,config,designers,pages,coupons,productsets,senser,navList})).then(()=>{dev && console.log('hello world, danialz in the scene x_x')})
      // store.dispatch(setDoua(locale))
      setToken(true)
      window.addEventListener('load', () => setprogress(false))
      setTimeout(()=>setprogress(false),6000)
    }
    return () => {
      // console.log('unsub')
    }
    // getFetch('/sanctum/csrf-cookie',true);
  },[tokenize,locale,config,designers,pages,coupons,productsets,senser,navList,dev])
  return (
    <Provider store={store}>
      <Layout loading={loading} pages={pages} config={config} locale={locale}>
      <Component redirect={REDIRECT} {...props} {...pageProps}></Component>
      </Layout>
    </Provider>
  )
}

let apicallnum=0;
APPLICATION.getInitialProps = async ({Component, req, router, ctx}) => {
  // if (ctx.isServer) {console.log('isServere')}else{console.log('isServerni')}
  let state = await store.getState().root,meta=false
  if(state.config==false || state.locale!=router.locale){
  apicallnum++;
  // console.log(req,state,`initial client network in ${apicallnum}th`);
  await store.dispatch(setInit(router.locale))
  state = await store.getState().root
  }
  // const currentUrl=decodeURI(router.asPath.split("?")[0].split("#")[0]);
  // await postFetch('getDescription',{currentUrl},'public').then((result)=>{
  //     if(result.status=='200'){
  //       meta={title:result.title,description:result.description}
  //     }
  // });
  const { config,navList,pages,coupons,productsets,senser,designers,locale } = state
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
  return { props: {pageProps,meta,config,navList,pages,coupons,productsets,senser,designers,locale}, disableOnClientSideNavigation: true };
}

const makeStore = () => store;
const wrapper = createWrapper(makeStore);
export default wrapper.withRedux(APPLICATION);

// class APPLICATION extends App {
//   static async getInitialProps({Component, router, ctx}) {
//     let state = await store.getState().root
//     if(state.config==false){
//     await store.dispatch(setInit(router.locale))
//     state = await store.getState().root
//     }
//     // const state = await store.getState().root
//     const { config,navMenu,navList,designers,locale } = state
//     const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
//     return {pageProps,config,navMenu,navList,designers,locale};
//     // return {pageProps};
//   }
//   render(){
//     setInterval(function(){
//       // console.log(store.getState().root.config,'nooni')
//     },5000)
//     const { Component, pageProps, config, navMenu, navList, designers, locale } = this.props
//     pageProps['config']=config
//     console.log(config,'s');
//     return (
//       <Provider store={store}>
//         <Layout config={config} navMenu={navMenu} navList={navList} designers={designers} locale={locale}>
//         {store.getState().root.loading ? 'loading...' : 'not loading'}
//         <Component {...pageProps}></Component>
//         </Layout>
        
//       </Provider>
//     )
//   }
// }

// const App = ({ config, locale, blog, navMenu, navList, designers, Component, pageProps }) => {
//   const [loading,setprogress] = useState(false);
//   Router.events.on('routeChangeStart', url => setprogress(true))
//   Router.events.on('routeChangeComplete', () => setprogress(false))
//   // const reduxStore = useStore(pageProps.initialReduxState);
//   // Router.events.on('routeChangeError', () => setprogress(false))
//   // return <Layout loading={loading} config={config} blog={blog} navList={navList} designers={designers} navMenu={navMenu} locale={locale}><Component config={config} {...pageProps} /></Layout> 
//   return <Layout loading={loading} config={config} blog={blog} navList={navList} designers={designers} navMenu={navMenu} locale={locale}><Component config={config} {...pageProps} /></Layout> 
// }


// App.getInitialProps = async context => {
//   const appProps = await MyApp.getInitialProps(context);
//   const { router, req } = context;
//   //initialise redux store on server side
//   const reduxStore = initialiseStore({});
//   const { dispatch } = reduxStore;
//   const init = await initAPI(router.locale);
//   dispatch(setInit({ navList: init.navList, navMenu: init.navMenu, designers: init.designers, config:init.config, locale: router.locale }));

//   appProps.pageProps = {
//     ...appProps.pageProps,
//     initialReduxState: reduxStore.getState(),
//   };

//   return appProps;
// };




// App.getInitialProps = async context => {
    // const { router, req } = context;
    // const init = await initAPI(router.locale);
    // if(localStorage.getItem("lastname")){
    //   init=localStorage.init;
    //   console.log('dareeee',init,'dareee')      
    // }else{
    //   const init = await initApp(router.locale);
    //   localStorage.setItem("init", init);
    // }
    // if(isServer){

    //   console.log('server');
    //   console.log('server');
    //   console.log('server');
    //   console.log('server');
    //   console.log('server');
    //   console.log('server');
    //   console.log('server');
    // }
    // return {
    //   config:init.config,
    //   blog:[0,2],
    //   navMenu:init.navMenu,
    //   navList:init.navList,
    //   designers:init.designers,
    //   locale:router.locale
    // }
//     return {
//       config:[],
//       blog:[0,2],
//       navMenu:[],
//       navList:[],
//       designers:[],
//       locale:router.locale
//     }
// }
// export const getStaticProps = async ({ Component, ctx, router }) => {
//   const call = await fetch(`${server}/meow/init?locale=${router.locale}`)
//   const response = await call.json()
//   const config = response.config;  
//   console.log('hey')
//   return {
//     config,
//     locale:router.locale
//   }
// }
// App.getInitialProps = async ({ Component, ctx, router }) => {
//   const call = await fetch(`${server}/meow/init?locale=${router.locale}`)
//   const response = await call.json()
//   const config = response.config;  
//   return {
//     config,
//     locale:router.locale
//   }
// }

// export default App
