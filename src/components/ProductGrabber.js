import React, { Component } from 'react';
import Link from 'next/link';
import translate from '@/config/translate';
// import Image from 'next/image';

export default class ProductGrabber extends Component {
    constructor(props){
        super(props);
        this.state={
            bachkhaabe:true,userData:false
        }
        this.goProduct = this.goProduct.bind(this);
        this.wakeupbache = this.wakeupbache.bind(this);
    }
    componentDidMount(){
        if(this.props.minimal){this.setState({bachkhaabe:false})}
    }
    toEnglishDigits(str){if(this.props.locale!='fa' && this.props.locale!='ar'){return str}var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];return str.replace(/[0-9]/g, function (w) {return id[+w];});}
    numberWithCommas(x){return this.toEnglishDigits(x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));}
    substrBytes(str, start, length){
        let buf=str;
        return buf.slice(start, start+length).toString();
    }
    goProduct(e){
        localStorage.setItem('goproduct',e.currentTarget.dataset.key);
    }
    wakeupbache(e){
        const escruw=$(e.currentTarget).parent().parent().offset().top
        this.setState({'bachkhaabe':!this.state.bachkhaabe},()=>{
            if(!this.state.bachkhaabe){
                $([document.documentElement, document.body]).animate({scrollTop:escruw},200);
            }
        })
    }
    mulababy(cash){
        switch(this.props.locale){
          case 'en':
            cash='$ '+Math.floor(cash/this.props.config.USD)
            break;
          case 'ar':
            cash=Math.floor(cash/this.props.config.DR)+' درهم'
            break;
          case 'fa':
            cash+=' تومان'
            break;
          default:
            return cash
        }
        return this.numberWithCommas(cash)
    }
    render(){
        const iprops=translate[this.props.locale]
        const self=this;
        let encodeUrl=(str)=>{return str ? str.replace(/ /g,'-') : 'w8'}
        let decodeUrl=(str)=>{return str ? str.replace(/-/g, ' ') : 'w8'}
        let products;
        let keyNum=0;
        console.log(self.props.products,'hey');
        products=Object.values(self.props.products).map(function(value,key){
            let is_hidden='';
            let somayenaro=false;
            // if(value.price){
            if(self.props.sql && value.id!=self.props.sql.id){
            // console.log(value.color);
            let brandname='';
            if(self.props.designers){
                self.props.designers.forEach(function(item,i){
                    if(value.designer==item.id){
                        brandname=item.brand;
                    }
                });
            }
            let customsew=false;
            if(value.customsew!='' && value.customsew!=null){
                JSON.parse(value.customsew).forEach(function(item,i){
                    if(i==1){customsew=true;}
                });
            }
            let producturl=value.title;
            let productprice=value.price;
            let coupon=false;
            let couponpercent=0;
            if(value.url!='' && value.url!=null){producturl=value.url;}
            {self.props.coupons && Object.values(self.props.coupons).map(function(couponvalue,couponkey){
                if(!coupon && couponvalue.type=='product' && (couponvalue.target=='all' || couponvalue.target==value.pid)){
                    if(couponvalue.numtype=='percent'){
                        productprice=productprice-((couponvalue.num/100)*productprice);
                        couponpercent=couponvalue.num;
                    }else{
                        productprice=productprice-couponvalue.num;
                        couponpercent=Math.floor(((value.price-productprice)/value.price)*100);
                    }
                    if(productprice<0){productprice=0;}
                    coupon=true;
                }
            })}
            if(!somayenaro){
            keyNum++;
            return (<Link key={`squarecontent-0-${key}`} href={`/product-${value.pid}/${encodeURIComponent(encodeUrl(producturl))}#${encodeUrl(value.colorurl)}`}><a onClick={self.goProduct.bind(this)} data-key={`squarecontent-0-${key}`} className={`iproduct-${key} completeyourstylecol squareitem animated fadeIn ${is_hidden}`}>
                <div className="completeyourstylecolimg animated fadeIn delay-1s"><img alt={value.title+' '+value.colortitle} src={value.img}/>{coupon ? (<span className="catpreviewcoupon">% {self.toEnglishDigits(couponpercent.toString())}</span>) : ('')}</div>
                <h5 className="completeyourstylecolbrand">{brandname}</h5>
                <div className="completeyourstylecoltitle" data-for={`enrich`} data-tip={value.title+' '+value.colortitle}>{self.substrBytes(value.title,0,30)==value.title ? (value.title) : (self.substrBytes(value.title,0,30)+'...')}</div>
                {value.count==0 ? (<div className="completeyourstylecolprice"><span>{iprops.unavailable}</span></div>) : (<>
                <div className="completeyourstylecolprice"><span>{self.mulababy(value.price)}</span>{coupon ? (<span>{self.mulababy(productprice)}</span>) : ('')}</div>
                </>)}
            </a></Link>);
            }
            }
        });
        // return <span>sssss</span>
        if(products.length==0 || keyNum==0){
            if(products.length!=keyNum){
            products=(<div className="catpreviewitem squareitem animated fadeIn squarenotfound">
                <div className="squarecontent">
                    <div className="squareTitle">{iprops.noproductsfound}!</div>
                </div>
            </div>);
            }else{
            products=(<div className="catpreviewitem squareitem animated fadeIn squarenotfound">
                <div className="squarecontent">
                    <div className="squareTitle">{iprops.processing} ...</div>
                </div>
            </div>);
            }
            return <></>
        }else{   
            return (<div className={`${this.props.minimal ? 'container-minimal ' : ''}container-cafca probox`}>
                {this.props.minimal ? '' : <div className="bachhead">
                    <h2>{this.props.title}</h2>
                    {keyNum>5 ? <div className="wakeupbache" onClick={(e)=>this.wakeupbache(e)}>{this.state.bachkhaabe ? iprops.more : iprops.fewer}</div> : ''}
                </div>}
                <div className={`bachmoney${this.state.bachkhaabe ? ' zzz' : ''} completeyourstylerow`}>
                    {products}
                </div>
            </div>)
        }
        
    }
}