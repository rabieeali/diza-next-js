import { sql_query } from '../../lib/db'
// import Cors from 'cors'
// const initMiddleware=(middleware)=>{
//     return (req, res) =>
//       new Promise((resolve, reject) => {
//         middleware(req, res, (result) => {
//           if (result instanceof Error) {
//             return reject(result)
//           }
//           return resolve(result)
//         })
//       })
//   }
// const cors = initMiddleware(
//     // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
//     Cors({
//       // Only allow requests with GET, POST and OPTIONS
//       methods: ['GET', 'POST', 'OPTIONS'],
//     })
// )

  
const handler = async (req, res) => {
    try {
        const { locale } = req.query
        const config = await sql_query(`
            SELECT * FROM variables
            WHERE locale='${locale}'
        `);
        const designers = await sql_query(`
            SELECT * FROM designers
            WHERE locale='${locale}'
            ORDER BY priority ASC
        `);
        let navMenu=[]
        const getnavcategories = await sql_query(`
            SELECT distinct(nav) FROM categories
            WHERE locale='${locale}'
        `);
        getnavcategories.forEach(o=>{
          navMenu.push(o['nav'])
        })
        let navList={}
        const getallcategories = await sql_query(`
            SELECT * FROM categories
            WHERE locale='${locale}'
            ORDER BY priority ASC
        `);
        const getsexcategories = await sql_query(`
            SELECT distinct(sex) FROM categories
            WHERE locale='${locale}'
            ORDER BY priority ASC
        `);
        getsexcategories.forEach(sexcategorie=>{
          sexcategorie=sexcategorie['sex']
          let CategoriesOnce={}
          getallcategories.forEach(allcategorie=>{
            if(allcategorie['sex']==sexcategorie){
              CategoriesOnce[allcategorie['nav']]=[]             
            }
          })
          getallcategories.forEach(allcategorie=>{
            if(allcategorie['sex']==sexcategorie){
              CategoriesOnce[allcategorie['nav']].push(allcategorie)
            }
          })
          navList[sexcategorie]=CategoriesOnce
        })
        // await cors(req, res)
        return res.status(200).json({designers,navMenu,navList,config:config[0]})
    } catch (e) {
        res.status(500).json({ message: e.message})
    }
}

export default handler