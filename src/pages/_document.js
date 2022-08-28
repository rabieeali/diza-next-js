import Document, { Html, Head, Main, NextScript } from 'next/document'
import Router from 'next/router'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps, locale: ctx?.locale || 'fa' }
    }
    render = () => {
        return(
        <Html dir={this.props.locale === 'en' ? 'ltr': 'rtl'} lang={this.props.locale}>
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
        )
    }
}

export default MyDocument