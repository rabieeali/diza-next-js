import Head from 'next/head'
import translate from '@/config/translate'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../../components/Dashboard'),
  { ssr: false, loading: () => <span style={{display:'block',padding:'15px',height:'80vh'}}>w8...</span> }
)
// import { sql_query } from '../../../lib/db'
// import Dashboard from '../../components/Dashboard'
  
export default function HiDashboard({redirect,locale,coupons,config,...pageProps}) {
  const iprops=translate[locale]
  const capitalizeFirstLetter = (string) => { return string.charAt(0).toUpperCase() + string.slice(1); }
  const router = useRouter()
  const url=router.asPath;
  let title=iprops.dashboard.title
  if(url=='/dashboard/profile'){
      title=iprops.dashboard.profile;
  }else if(url=='/dashboard/login'){
      title=iprops.loginsignup;
  }else if(url=='/dashboard/favorites'){
      title=iprops.dashboard.wishlist;
  }else if(url=='/dashboard/grievance'){
      title=iprops.dashboard.referralrequest;
  }else if(url=='/dashboard/suggestion'){
      title=iprops.dashboard.criticsandsuggestions;
  }else if(url=='/dashboard/orders'){
      title=iprops.dashboard.myorders;
  }else if(url=='/dashboard/gifts'){
      title=iprops.dashboard.mygifts;
  }else if(url=='/dashboard/lastvisits'){
      title=iprops.dashboard.recentvisits;
  }else if(url=='/dashboard/notices'){
      title=iprops.dashboard.notifications;
  }
  title=capitalizeFirstLetter(title)
  return (
    <>
      <Head>
        <title>{title+config.masterTitle}</title>
        <meta property="og:title" content={title} />
      </Head>
      <DynamicComponentWithNoSSR title={title} coupons={coupons} config={config} locale={locale} redirect={redirect} {...pageProps} />
      {/* <Dashboard title={title} redirect={redirect} {...pageProps} /> */}
    </>
  )
}