const development = process.env.NODE_ENV != 'production'

// export const server = development ? 'http://localhost:8000' : 'https://diza.gallery'
export const server = development ? 'http://localhost:8000' : 'http://localhost:8000'
export const root = development ? 'http://localhost:3000' : 'http://localhost:3000'

export const API = server 

const INNER_API = root + '/api'
export default INNER_API 