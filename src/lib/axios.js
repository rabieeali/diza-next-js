import axios from 'axios'

export default axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    // headers: {
    //     'X-Requested-With': 'XMLHttpRequest',
    // },
    // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    headers: { Accept: 'application/json' },
    withCredentials: true
})