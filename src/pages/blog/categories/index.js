import Head from 'next/head'
import { sql_query } from '../../../lib/db'
import { BlogCategories } from '../../../components/Blog'
  
export default function hiBlog({locale,redirect,config,...pageProps}) {
return (
    <>
      <Head>
        <title>{config.blogTitle+config.masterTitle}</title>
        <meta name="description" content={config.blogDescripion} />
        <meta property="og:title" content={config.blogTitle} />
        <meta property="og:description" content={config.blogDescripion} />
      </Head>
      <BlogCategories redirect={redirect} locale={locale} {...pageProps} />
    </>
  )
}

export async function getServerSideProps(context) {
    const Biggie = (string) => {
        return string[0].toUpperCase() + string.slice(1).toLowerCase();
    }
    try {
        let loca='';
        if(context.locale!='fa'){ loca=Biggie(context.locale) }
        let categoriesAll = await sql_query(`
            SELECT title${loca} as title,nav${loca} as nav,img,url,priority,id,created_at FROM blogcats
            ORDER BY priority ASC
        `);
        let categoriesNav = await sql_query(`
            SELECT DISTINCT(nav${loca}) FROM blogcats
            ORDER BY priority ASC    
        `);
        categoriesNav = JSON.parse(JSON.stringify(categoriesNav))
        categoriesAll = JSON.parse(JSON.stringify(categoriesAll))
        let blogcategories={};
        categoriesNav.forEach(categoriesN => {
            categoriesN=categoriesN['nav'+loca]
            blogcategories[categoriesN]=[]
            categoriesAll.forEach(categoriesA=>{
                if(categoriesA['nav']==categoriesN){
                    blogcategories[categoriesN].push(categoriesA)
                }
            })
        });
        return {
            props:{blogcategories}
        } 
    } catch (e) {
        return {
            props:{categories: false}
        }
    }
}