import React, { Component } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
// import Image from 'next/image';
// import OwlCarousel from 'react-owl-carousel2';

const OwlCarousel = dynamic(import("react-owl-carousel"), {ssr: false});

export default class RelatedProducts extends Component {
    constructor(props){
        super(props);
        this.state={
            products:[],userData:false,datageted:false
        }
        this.goProduct = this.goProduct.bind(this);
    }
    componentDidMount(){
        
    }
    componentDidUpdate(prevProps,prevState){    
        if(prevProps.sql){
        setTimeout(function(){
            // console.log('owl refreshed');
            $(".owl-productRelated").trigger('refresh.owl.carousel');
        },300);
        }
    }
    toEnglishDigits(str){var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];return str.replace(/[0-9]/g, function (w) {return id[+w];});}
    numberWithCommas(x){return this.toEnglishDigits(x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));}
    substrBytes(str, start, length){
        let buf=str;
        return buf.slice(start, start+length).toString();
    }
    goProduct(e){
        localStorage.setItem('goproduct',e.currentTarget.dataset.key);
    }
    render(){
        const self=this;
        let encodeUrl=(str)=>{return str ? str.replace(/ /g,'-') : 'w8'}
        let decodeUrl=(str)=>{return str ? str.replace(/-/g, ' ') : 'w8'}
        const owlProbox={
            responsive:{
                1260:{items:4},
                500:{items:2},
                0:{items:1}
            },
            items:4,
            autoHeight:true,
            autoHeightClass: 'owl-height',
            margin:15,
            dots:false,
            nav:true,
            slideSpeed:300,
            rtl:true,
            loop:true
        };
        let products;
        let keyNum=0;
        console.log(self.props.products,'hey');
        products=Object.values(self.props.products).map(function(value,key){
            let is_hidden='';
            let somayenaro=false;
            // if(value.price){
            if(self.props.sql && value.cat==self.props.sql.cat && value.id!=self.props.sql.id){
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
            return (<Link key={`squarecontent-0-${key}`} href={`/product-${value.pid}/${encodeURIComponent(encodeUrl(producturl))}#${encodeUrl(value.colorurl)}`}><a onClick={self.goProduct.bind(this)} data-key={`squarecontent-0-${key}`} className={`iproduct-${key} catpreviewitem squareitem animated fadeIn ${is_hidden}`}>
                <div className="squarecontent">
                <div className="catpreviewimg animated fadeIn delay-1s"><img alt={value.title+' '+value.colortitle} src={value.img}/>{coupon ? (<span className="catpreviewcoupon">% {self.toEnglishDigits(couponpercent.toString())}</span>) : ('')}</div>
                <div className="catpreviewitembar">
                    <h5>{brandname}</h5>
                    <div className="catpreviewcat" data-for={`enrich`} data-tip={value.title+' '+value.colortitle}>{self.substrBytes(value.title,0,30)==value.title ? (value.title) : (self.substrBytes(value.title,0,30)+'...')}</div>
                    {value.count<=0 ? (<>{customsew ? (<div className="catpreviewprice"><span>سفارشی</span></div>) : (<div className="catpreviewprice"><span>ناموجود</span></div>)}</>) : (<>
                    <div className="catpreviewprice"><span>{self.numberWithCommas(value.price)} تومان</span>{coupon ? (<span>{self.numberWithCommas(productprice)} تومان</span>) : ('')}</div>
                    </>)}
                </div>
                </div>
            </a></Link>);
            }
            }
            // }
        });
        if(products.length==0 || keyNum==0){
            if(products.length!=keyNum){
            products=(<div className="catpreviewitem squareitem animated fadeIn squarenotfound">
                <div className="squarecontent">
                    <div className="squareTitle">محصولی یافت نشد!</div>
                </div>
            </div>);
            }else{
            products=(<div className="catpreviewitem squareitem animated fadeIn squarenotfound">
                <div className="squarecontent">
                    <div className="squareTitle">در حال پردازش ...</div>
                </div>
            </div>);
            }
        }
        return (<React.Fragment>
            <OwlCarousel rtl={true} key="oWLprobox-1" options={owlProbox} className={`owl-productRelated owl-carousel ${self.props.locale=='fa' ? 'owl-rtl' : ''}`}>
            {/* <OwlCarousel responsive={
                1260:{items:4},
                500:{items:2},
                0:{items:1}
            } items={4} autoHeight autoHeightClass="owl-height" margin={15} dots nav slideSpeed={300} rtl loop key="oWLprobox-1" ref="productRelated" className={`owl-productRelated owl-carousel ${self.props.locale=='fa' ? 'owl-rtl' : ''}`}> */}
                {products}
            </OwlCarousel>
        </React.Fragment>)
    }
}