import Head from 'next/head'
import { sql_query } from '../../../lib/db'
import { useRouter } from 'next/router'
import { BlogCategorie } from '../../../components/Blog';

export default function HiBlogCat({redirect,locale,blog,blogcategories,categorie,config,...pageProps}) {
const router = useRouter()
const {url} = router.query
let title=config.blogTitle,description=config.blogDescription
const capitalizeFirstLetter = (string) => { return string.charAt(0).toUpperCase() + string.slice(1); }
if(categorie.title!=''){ title=capitalizeFirstLetter(categorie.title),description=categorie.description }
return (
    <>
      <Head>
        <title>{title+config.masterTitle}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
      {/* blog={this.state.blog} blogcategories={this.state.blogcategories} blogcomments={this.state.blogcomments} bloglikes={this.state.bloglikes} */}
      <BlogCategorie locale={locale} redirect={redirect} url={url} blogcategories={blogcategories} categorie={categorie} blog={blog} {...pageProps}/>
    </>
  )
}

export async function getServerSideProps(context) {
    const Biggie = (string) => {
        return string[0].toUpperCase() + string.slice(1).toLowerCase();
    }
    const {url}=context.query
    try {
        let loca='';
        if(context.locale!='fa'){ loca=Biggie(context.locale) }
        let categorie = await sql_query(`
            SELECT title${loca} as title,nav${loca} as nav,img,url,priority,id,created_at FROM blogcats
            WHERE url='${url}'
        `);
        categorie = JSON.parse(JSON.stringify(categorie))[0]
        if(typeof categorie==='undefined'){
            return {
                redirect: {
                    destination: `${context.locale!='fa' ? '/'+context.locale : ''}/404`,
                },
            };
        }
        let blog = await sql_query(`
            SELECT title${loca} as title,description${loca} as description,content${loca} as content,type,audio,video,img,cat,views,duration,url,id,created_at FROM blog
            WHERE title${loca}!='' AND FIND_IN_SET('${categorie.id}', cat)
            ORDER BY id DESC
        `);
        blog=JSON.parse(JSON.stringify(blog))
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
        return {props:{blogcategories,categorie,blog}}
    } catch (e) {
        console.log(e,'is error')
        return {
            props:{categorie: false, blog: false,url}
        }
    }
}