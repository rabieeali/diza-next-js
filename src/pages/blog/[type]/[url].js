import Head from 'next/head'
import { sql_query } from '../../../lib/db'
import { useRouter } from 'next/router'
import { BlogSingle } from '../../../components/Blog';

export default function HiBlogSingle({senser,blog,blogcategories,blogcomments,redirect,locale,config,...pageProps}) {
const router = useRouter()
const {url,type} = router.query
let title=config.blogTitle,description=config.blogDescription
blog.map(blo=>{
    if(blo.url==url && blo.type==type){title=blo.title;description=blo.description}
})
// const capitalizeFirstLetter = (string) => { return string.charAt(0).toUpperCase() + string.slice(1); }
// if(categorie.title!=''){ title=capitalizeFirstLetter(categorie.title),description=categorie.description }
const bloglikes=[]
return (
    <>
      <Head>
        <title>{title+config.masterTitle}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
      <BlogSingle redirect={redirect} url={url} type={type} locale={locale} config={config} senser={senser} blog={blog} blogcategories={blogcategories} blogcomments={blogcomments} bloglikes={bloglikes} />
    </>
    )
}

export async function getServerSideProps(context) {
    const Biggie = (string) => {
        return string[0].toUpperCase() + string.slice(1).toLowerCase();
    }
    const {url,type}=context.query
    try {
        let loca='';
        if(context.locale!='fa'){ loca=Biggie(context.locale) }
        let currentcategories = await sql_query(`
            SELECT DISTINCT cat,id FROM blog
            WHERE url='${url}' AND type='${type}'
        `);
        currentcategories=JSON.parse(JSON.stringify(currentcategories))
        if(currentcategories.length==0){
            return {
                redirect: {
                    destination: `${context.locale!='fa' ? '/'+context.locale : ''}/404`,
                },
            };   
        }
        const currentid=currentcategories[0].id
        currentcategories=currentcategories[0].cat.split(',')[0]
        let blog = await sql_query(`
            SELECT title${loca} as title,description${loca} as description,content${loca} as content,type,audio,video,img,cat,views,duration,url,id,created_at FROM blog
            WHERE url='${url}' AND type='${type}' OR FIND_IN_SET('${currentcategories}', cat) AND title${loca}!=''
            ORDER BY id DESC
        `);
        blog=JSON.parse(JSON.stringify(blog))
        let blogcomments = await sql_query(`
            SELECT id,userphone,username,content,reply,blogid,status,created_at FROM blogcomments
            WHERE blogid='${currentid}'
            ORDER BY id DESC
        `);
        blogcomments=JSON.parse(JSON.stringify(blogcomments))
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
        return {props:{blogcategories,blog,blogcomments,currentcategories}}
    } catch (e) {
        console.log(e,'is error')
        return {
            props:{blog: false, blogcategories: false, blogcomments:false}
        }
    }
}



// export const getServerSideProps = async context => {
//     const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${context.params.id}`)
//     const article = await response.json()
//     return {
//         props: {
//             article
//         }
//     }
// }

// export const getStaticProps = async context => {
//     const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${context.params.id}`)
//     const article = await response.json()
//     return {
//         props: {
//             article
//         }
//     }
// }
// export const getStaticPaths = async () => {
//     const response = await fetch(`https://jsonplaceholder.typicode.com/posts`)
//     const articles = await response.json()
//     const ids = articles.map(article => article.id)
//     const paths = ids.map(id => ({ params: {id: id.toString()} }))

//     return {
//         paths,
//         fallback:false
//     }
// }