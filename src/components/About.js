import {Component} from 'react';
import Link from 'next/link';
import translate from '@/config/translate';
import dynamic from "next/dynamic";
import {useRouter} from 'next/router'

// const LoginPage = dynamic(() => import("./contact-us"));
export default class About extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const iprops = translate[this.props.locale]
        // this.props.redirect('/contact-us');
        // return (<Redirect to="/"/>)
        // return (<LoginPage />)
        const nl2br = require('react-nl2br');
        return (<>
            <div className="whereami inmobile">
                <a></a>
                <a></a>
                <Link href="/">{iprops.home}</Link>
                <a>{this.props.config.aboutTitle}</a>
            </div>
            <section className="designersportal">
                <a className="designersportalCenter">{iprops.aboutdiza}</a>
            </section>
            <section className="aboutsection">
                {this.props.config.aboutText && (<div className="aboutbox">
                    <div className="aboutboxcontent">{nl2br(this.props.config.aboutText)}</div>
                </div>)}
                {this.props.config.aboutText2 && (<div className="aboutbox">
                    <div className="aboutboxcontent">{nl2br(this.props.config.aboutText2)}</div>
                </div>)}
                {this.props.config.aboutText3 && (<div className="aboutbox">
                    <div className="aboutboxcontent">{nl2br(this.props.config.aboutText3)}</div>
                </div>)}
            </section>
        </>);
    }
}  