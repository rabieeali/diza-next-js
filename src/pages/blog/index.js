import { useEffect } from 'react';
import Head from 'next/head'
// import { useRouter } from 'next/router'
import Image from 'next/image'


export default function Blog({...pageProps}) {
    // const router = useRouter()
    // useEffect(() => {
    //     router.push('/blog/categories')
    // })
  return (
    <>
    </>
  )
}

export async function getServerSideProps({ res, params }) {
    res.statusCode = 302
    res.setHeader('Location', `/blog/categories`)
    return {props: {}}
}