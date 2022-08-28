import Head from 'next/head'
// import styles from '../styles/Layout.module.css'
import Nav from './Nav'
import Footer from './Footer'
import { initAPI } from '../lib/data'
import {server} from '../config'
import { useEffect } from 'react'
import store from '../redux/store'
import { useRouter } from 'next/router'
import ReactTooltip from 'react-tooltip';
import Standalone from './Standalone';

const Master = ({children,pages,config,loading,locale}) => {
  const blog=[0,5]
  const router = useRouter()
  const upper = () => {
    $("html, body").animate({ scrollTop: 0 },300);
  }
  return (
    <div id="dipty" className={`${loading ? loading==7 ? 'superloading loading ' : 'loading ' : ''}${locale}`}>
    {/* <div className={styles.container}> */}
      <Head>
        <meta name="csrf-token" content=" Reality is wrong. Dreams are for real. " />
        <meta name="robots" content="index,follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Diza" />
        {/* <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" /> */}
        <meta name="theme-color" content="#a1b7a1" />
        <link rel="apple-touch-icon" href="/img/icon-512.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/img/icon-152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/img/icon-180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/img/icon-167.png" />
        <link rel="apple-touch-startup-image" href="/img/apple-lunch-image-640x1136.png" media="(device-width:  320px) and (device-height:  568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/> 
        <link rel="apple-touch-startup-image" href="/img/apple-lunch-image-750x1334.png" media="(device-width:  375px) and (device-height:  667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="/img/apple-lunch-image-828x1792.png" media="(device-width:  414px) and (device-height:  896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="/img/apple-lunch-image-1125x2436.png" media="(device-width:  375px) and (device-height:  812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="/img/apple-lunch-image-1242x2208.png" media="(device-width:  414px) and (device-height:  736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="/img/apple-lunch-image-1242x2688.png" media="(device-width:  414px) and (device-height:  896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="/img/apple-lunch-image-1536x2048.png" media="(device-width:  768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="/img/apple-lunch-image-1668x2224.png" media="(device-width:  834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="/img/apple-lunch-image-1668x2388.png" media="(device-width:  834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="/img/apple-lunch-image-2048x2732.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <div className="loadinginner"></div>
      <Nav locale={locale} config={config} />
      {router.pathname=='/' ? null : <header></header>}
      {children}
      <Footer locale={locale} config={config} pages={pages} blog={blog} />
      {/* <Footer config={this.state.config} pages={this.state.pages}/> */}
      <Standalone/>
      <div className="upper" onClick={upper}></div>
      <ReactTooltip backgroundColor="#a1b7a1f0" textColor="#222" place="bottom" effect="float"/>
    </div>
  )
}

Master.getServerSideProps = async (ctx) => {
  console.log('yyyy');
  return {}
}


// Master.getServerSideProps = async (ctx) => {
//   const init = await initAPI('fa');
//   console.log(`y
//   y
//   y
//   y
//   yyyy
//   y
//   y
//   y
//   y
  
//   yy
//   `);
//   return {
//     config:init.config,
//     blog:[0,2],
//     navMenu:init.navMenu,
//     navList:init.navList,
//     designers:init.designers,
//     locale:router.locale
//   }
// }

export default Master