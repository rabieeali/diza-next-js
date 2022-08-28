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
        // await cors(req, res)
        return res.status(200).json({designers,config:config[0]})
    } catch (e) {
        res.status(500).json({ message: e.message})
    }
}

export default handler