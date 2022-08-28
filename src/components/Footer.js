import React, { Component } from 'react'
import Link from 'next/link'
import $ from 'jquery'
import img_ecunion from '../../public/img/ecunion.png';
import img_enamad from '../../public/img/footerbanner3.png';

export default class Footer extends Component {
    constructor(props){
        super(props);
        this._handleKeyDown = this._handleKeyDown.bind(this);
        this.getmebish=this.getmebish.bind(this);
    }
    // BLOCKEVERYBODY START
    getmebish(){
        $('.getoutbish').addClass('youwinbish');
    }
    runbish(){
        let top=Math.floor(Math.random() * $(window).height()) + 0;
        let left=Math.floor(Math.random() * $(window).width()) + 0;
        setTimeout(function(){
            $('.getmebish').css({'left':left,'top':top});
        },200);
    }
    _handleKeyDown(){
        if(event.key=='Alt'){         
            this.getmebish();
        }
    }
    componentDidMount(){
        document.addEventListener("keydown", this._handleKeyDown);
    }
    ecunion(){
        window.open('https://ecunion.ir/verify/diza.gallery?token=51000595f72f3b673c26', 'Popup','toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=580, height=600, top=30');
    }
    // BLOCKEVERYBODY END
    render() {
        let pages=[]
        if(this.props.pages){
        pages=Object.values(this.props.pages).map(function(value,key){if(value.type=='footer'){return(
        <Link href={`/page/${value.url}`} key={key}><a className="animated fadeIn" style={{'animationDelay':(key/5)+'s'}}>{value.title}</a></Link>
        );}});
        }
        let raw;
        if(this.props.config){
            raw=JSON.parse(this.props.config.raw);
            // console.log(raw)
        }
        // console.log('config:',config);
        return (
            <React.Fragment>
               {this.props.config && (<footer>
               <div className="footerlinks">
                <div className="footerlinkbox">
                <h3>{raw.footer_box1_title}</h3>
                {this.props.locale=='fa' ? (<Link className="animated fadeIn" href="/blog/categories">{raw.footer_link_blog}</Link>) : null}
                <Link href="/about-us">{raw.footer_link_about}</Link>
                <Link href="/contact-us">{raw.footer_link_contact}</Link>
                {/* <Link to="/receipts">{raw.footer_link_receipt}</Link> */}
                </div>
                <div className="footerlinkbox">
                <h3>{raw.footer_box2_title}</h3>
                <Link href="/join-us">{raw.footer_link_join}</Link>
                {this.props.locale=='fa' ? pages : ''}
                </div>
                </div>
                <div className="footerabout">
                <div className="footeraboutright">
                <div className="footeraboutbox footeraboutsocials">
                {this.props.config && (<React.Fragment>
                {this.props.config.instagramUrl && <a href={this.props.config.instagramUrl} className="icon-instagram"></a>}
                {this.props.config.whatsappUrl && <a href={this.props.config.whatsappUrl} className="icon-whatsapp"></a>}
                {this.props.config.telegramUrl && <a href={this.props.config.telegramUrl} className="icon-telegram"></a>}
                {this.props.config.twitterUrl && <a href={this.props.config.twitterUrl} className="icon-twitter"></a>}
                </React.Fragment>)}
                </div>
                <div className="footeraboutbox">
                {/* <img src="/img/footerbanner1.png"/> */}
                {/* <img src="/img/footerbanner2.png"/> */}
                <img src="/img/ecunion.png" alt="" onClick={this.ecunion}/>
                <a referrerPolicy="origin" rel="noreferrer" target="_blank" href="https://trustseal.enamad.ir/?id=169400&amp;Code=lpif9h3fpqdrxQCLMHBw"><img referrerPolicy="origin" src="/img/footerbanner3.png" alt="" id="lpif9h3fpqdrxQCLMHBw"/></a>
                </div>
                <a target="_blank" rel="noreferrer" href="https://cafelead.agency" className="copyright">{raw.footer_poweredby}: <div data-tip="آژانس بازاریابی دیجیتال کافه لید" className="cafelead"><span>{raw.footer_cafelead}</span></div></a>
                </div>
                <div className="footeraboutleft">
                <div className="footeraboutleftcontent">
                <Link href="/"><a className="footerLogo"></a></Link>
                <h5>{raw.footer_slogan}</h5>
                </div>
                </div>
                </div>
               </footer>)}
               {/* <div className="getoutbish"><div className="getmebish" onMouseEnter={this.runbish} onClick={this.getmebish}></div></div> */}
            </React.Fragment>
        );
    }
}