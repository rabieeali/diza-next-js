import Head from 'next/head'

const Meta = ({title, description}) => {
    return (
        <Head>
            <title>{title}</title>
            <meta charSet="utf-8" />
            <meta name="description" content={description} />
            <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1" />
            <meta name="robots" content="index, follow" />
            <meta name="language" content="farsi" />
            <meta name="expires" content="never" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}

Meta.defaultProps = () => {
    
}

export default Meta