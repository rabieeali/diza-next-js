import React, { Component } from 'react';
import Link from 'next/link';
import Cookies from 'universal-cookie';
import $ from 'jquery';
import moment from 'moment-jalaali';
// import { DatePicker } from 'react-jdate-picker';
import Login from './Login';
import {postData} from '../lib/postData';
import translate from '@/config/translate';
const cookies = new Cookies();
export default class Cart extends Component{
    constructor(props){
        super(props);
        this.state={postingdates:[],products:false,price:0,coupon:'',coupons:[],couponerror:'',couponlimiterror:false,couponlimiterroramount:0,couponverify:false,isLogined:false,postingdate:'',postinghour:'۱۰ الی ۱۲',state:'',city:'',payin:'card',fullname:'',postcode:'',userphone:'',address:'',fixphone:'',email:'',cart:cookies.get('products') || false,userData:[],loading:false,success:false,step:1};
        this.goBack = this.goBack.bind(this);
        this.step1Cart = this.step1Cart.bind(this);
        this.step2Cart = this.step2Cart.bind(this);
        this.step3Cart = this.step3Cart.bind(this);
        this.step4Cart = this.step4Cart.bind(this);
        this.step5Cart = this.step5Cart.bind(this);
        this.checkLogin = this.checkLogin.bind(this);
        this.payinchoose = this.payinchoose.bind(this);
        this.changeCouponCode = this.changeCouponCode.bind(this);
        this.checkCoupon = this.checkCoupon.bind(this);
        this.onKeyPressCouponCode = this.onKeyPressCouponCode.bind(this);
        this.userUpdate = this.userUpdate.bind(this);
        this.initCart = this.initCart.bind(this);
        this.mulababy = this.mulababy.bind(this);
    }
    componentDidMount() {
        $('header,nav').addClass('minimize');
        $('.icon-cart').removeClass('added');
        // axios.post('/:api:products').then(response=>{
        //     this.setState({products:response.data},()=>this.setState({'loading':false}));
        // }).catch(errors=>{console.log(errors);});
        // this.setState({postingdate:moment().add(1,'days').format('jYYYY/jM/jD')});
        let i;
        let iMomment=[];
        for(i=1;i<7;i++){
            if(moment().add(i,'days').format('dddd')!='پنج‌شنبه' && moment().add(i,'days').format('dddd')!='آدینه'){
                iMomment.push(moment().add(i,'days').format('dddd jYYYY/jM/jD'));
            }
        }
        iMomment=iMomment.splice(0,4);
        this.setState({postingdates:iMomment});
        if(localStorage.getItem('userData')){
            let userData=JSON.parse(localStorage.getItem('userData'));
            this.setState({userData:userData,isLogined:true,address:userData.address,state:userData.state,city:userData.city,postcode:userData.postcode,email:userData.email,fullname:userData.fullname,userphone:userData.userphone});
        }
        this.initCart()
    }
    initCart(){
        let carthascustomsew=false;
        let productscount=0;
        let productsIds=[]
        const products=cookies.get('products') || false;
        if(products){
            Object.values(products.products).map(function(item,i){if(item){productsIds.push(item.id);productscount++;if(item.customsew){carthascustomsew=true;}}});
        }
        postData('productgrabber',{products:productsIds}).then((result)=>{
            if(result.status=='200'){
            this.setState({products:result.products})
            }
        });
    }
    checkLogin(){
        const iprops=translate[this.props.locale]
        if(localStorage.getItem('userData')){
            this.setState({'isLogined':true},()=>{
                $('.navProf span,.navProfMobile span').html(iprops.userarea);
                $('.navProf,.navProfMobile').attr('href','/dashboard/profile');
                let userData=JSON.parse(localStorage.getItem('userData'));
                this.setState({userData:userData,state:userData.state,city:userData.city,email:userData.email,address:userData.address,postcode:userData.postcode,fullname:userData.fullname,userphone:userData.userphone});
            });
        }else{
            this.setState({'isLogined':false},()=>{
                $('.navProf span,.navProfMobile span').html(iprops.loginsignup);
                $('.navProf,.navProfMobile').attr('href','/dashboard/login');
            });
        }
    }
    componentWillUnmount(){
        $('header,nav').removeClass('minimize');
        $('.navCat a').removeClass('superactive');
    }
    goBack(){
        this.props.history.goBack();
    }
    payin(){

    }
    changeValue(element, value){
    const event = new Event('input', { bubbles: true });
    element.value = value;
    element.dispatchEvent(event);
    }
    countdeleter(id,color,size,key){
        let products=cookies.get('products');
        let self=this;
        if(products){
            Object.values(products.products).map(function(item,i){
            if(item && item.id==id && item.color==color && item.size==size){
                delete products.products[i];
                let iconcartb=parseInt($('.icon-cart b').html());
                $('.icon-cart b').html(iconcartb-1);
            }
            });
            cookies.set('products',products,{path:'/'});
            this.setState({'cart':products});
        }
    }
    countupper(id,color,size,key,e){
        let products=cookies.get('products');
        let self=this;
        let btn=$(e.currentTarget);
        if(products){
            Object.values(products.products).map(function(item,i){
            if(item && item.id==id && item.color==color && item.size==size){
                let countlimit=item.countlimit;
                if(!('countlimit' in item)){countlimit=20;}
                let lastcount=item.count;
                let newcount=parseInt(lastcount)+1;
                if(newcount>countlimit){
                    btn.addClass('noway');
                    setTimeout(()=>{btn.removeClass('noway');},800);
                    return false;
                }else{
                    products.products[i].count=newcount;
                }
                // self.changeValue(document.querySelector('.icartrow-'+key+' input'),newcount);
            }
            });
            cookies.set('products',products,{path:'/'});
            this.setState({'cart':products});
        }
    }
    countdowner(id,color,size,key){
        let products=cookies.get('products');
        let self=this;
        if(products){
            Object.values(products.products).map(function(item,i){
            if(item && item.id==id && item.color==color && item.size==size){
                let lastcount=item.count;
                let newcount=parseInt(lastcount)-1;
                if(newcount==0){
                    delete products.products[i];
                    let iconcartb=parseInt($('.icon-cart b').html());
                    $('.icon-cart b').html(iconcartb-1);
                }else{
                products.products[i].count=newcount;
                // self.changeValue(document.querySelector('.icartrow-'+key+' input'),newcount);
                }
            }
            });
            cookies.set('products',products,{path:'/'});
            this.setState({'cart':products});
        }
    }
    step1Cart(){
        // alert('c');
        $('html,body').animate({scrollTop:0},200);
        this.setState({step:1});
    }
    isNumeric(value){
        return /^-?\d+$/.test(value);
    }
    step2Cart(price){
        if(typeof price !== "undefined" && this.isNumeric(price)){
            let products=cookies.get('products') || false;
            let productscount=0;
            if(products){ Object.values(products.products).map((item)=>{if(item){productscount++;}}); }
            if(productscount!=0){
                this.setState({'price':price});
                this.setState({step:2});
                $('html,body').animate({scrollTop:0},200);
            }  
        }else{
            this.setState({step:2});
            $('html,body').animate({scrollTop:0},200);
        } 
    }
    step3Cart(){
        let self=this;
        if(!self.state.fullname){
            $('.icart-input-fullname').addClass('error');
        }
        if(!self.state.userphone){
            $('.icart-input-userphone').addClass('error');
        }
        if(!self.state.postcode){
            $('.icart-input-postcode').addClass('error');
        }
        if(!self.state.state){
            $('.icart-input-state').addClass('error');
        }
        if(!self.state.city){
            $('.icart-input-city').addClass('error');
        }
        if(!self.state.address){
            $('.icart-input-address').addClass('error');
        }
        setTimeout(function(){$('.error').removeClass('error');},1000);
        $('html,body').animate({scrollTop:0},200);
        if(self.state.fullname && self.state.userphone && self.state.postcode && self.state.state && self.state.city && self.state.address){
            if(self.state.price==0){
                this.userUpdate();
                this.step5Cart();
            }else{
                this.setState({step:3});
                this.userUpdate();    
            }
        }
    }
    userUpdate(){
        let localUserData=JSON.parse(localStorage['userData']);
        let updateData={state:this.state,userData:localUserData};
        postData('userUpdate',updateData).then((result)=>{
        if(result.status=='200'){
            localStorage.setItem('userData',JSON.stringify(result.userData));
        }
        });
    }
    step4Cart(){
        $('html,body').animate({scrollTop:0},200);
        this.setState({step:4});
    }
    step5Cart(){
        let self=this;
        if(this.state.payin!=''){
        let coupon='';
        if(self.state.couponverify && self.state.coupon!=''){
            coupon=self.state.coupon;
        }
        let products=cookies.get('products').products;
        let uc_fullname=this.state.fullname||this.state.userData.fullname;
        let uc_phone=this.state.userphone||this.state.userData.userphone;
        // let uc_forward=this.state.postingdate+'، '+this.state.postinghour;
        let uc_useraddress=this.state.address||this.state.userData.address;
        let uc_postcode=this.state.postcode||this.state.userData.postcode;
        let uc_fixphone=this.state.fixphone;
        let uc_payinchoose=this.state.payin;
        let uc_state=this.state.state;
        let uc_city=this.state.city;
        let updateData={'products':products,'fullname':uc_fullname,'phone':uc_phone,'address':uc_useraddress,'postcode':uc_postcode,'coupon':coupon,'fixphone':uc_fixphone,'payin':uc_payinchoose,'ustan':uc_state,'shahr':uc_city,'userData':JSON.parse(localStorage.getItem('userData'))};
        postData('gonnapay',updateData).then((result)=>{
            self.setState({'success':true});
            cookies.remove('products');
            cookies.remove('products',{path:'/'});
            setTimeout(()=>{window.location=result.url;},100);
            // window.location.replace(result.url);
            // console.log(result);
        });
        this.setState({step:5});
        }
    }
    payinchoose(changeEvent){
        this.setState({'payin':changeEvent.target.value});
    }
    mulababy(cash,raw=false,reverse=false){
        if(!cash){
            switch(this.props.locale){
                case 'en': cash='$'; break;
                case 'fa': cash='تومان'; break;
                case 'ar': cash='درهم'; break;
            }
            return cash
        }
        if(raw){
            if(reverse){
                switch(this.props.locale){
                    case 'en': cash=Math.floor(cash*this.props.config.USD); break;
                    case 'ar': cash=Math.floor(cash*this.props.config.DR); break;
                }
            }else{
                switch(this.props.locale){
                    case 'en': cash=Math.floor(cash/this.props.config.USD); break;
                    case 'ar': cash=Math.floor(cash/this.props.config.DR); break;
                }
            }
            return this.numberWithCommas(cash)
        }
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
    toEnglishDigits(str){if(this.props.locale!='fa' && this.props.locale!='ar'){return str}var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];return str.replace(/[0-9]/g, function (w) {return id[+w];});}
    numberWithCommas(x){return this.toEnglishDigits(x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));}
    onKeyPressCouponCode(e){
        if(e.key==='Enter'){
            this.checkCoupon();
        }
    }
    checkCoupon(){
        const iprops=translate[this.props.locale]
        const self=this;
        let offer=false;
        const input=$('.cartresultcouponinput');
        const btn=$('.cartresultcouponsubmit');
        input.attr('disabled',true);
        btn.addClass('pending');
        let authedrequired=true;
        if(self.state.userData && self.state.userData.userphone){
            authedrequired=false;
        }else{
            if(self.state.coupon.includes("diza")){
                self.setState({couponerror:iprops.cart.tousethisdiscountcodeyoumustfirstlogin+'.'});
                setTimeout(function(){
                    self.setState({couponerror:'',coupon:''});
                    input.removeClass('error');
                    input.val('');
                    input.attr('disabled',false);
                    btn.removeClass('pending');
                },3000);
            }else{
                authedrequired=false;
            }
        }
        if(self.state.coupon==''){
            input.addClass('error');
            btn.removeClass('pending');
            setTimeout(function(){input.removeClass('error');input.val('');input.attr('disabled',false);},1000);
        }else if(!authedrequired){
            postData('couponchecker',{authed:authedrequired,id:self.state.coupon,'userData':JSON.parse(localStorage.getItem('userData'))},true).then(response=>{
                if(response.status=='200'){
                    // let amount=parseInt($('.cartresult-amount').data('value'));
                    self.setState({coupons:[response.coupon],'couponverify':true});
                    // if(response.data.coupon.numtype=='num' && response.data.coupon.num>=amount){
                    //     self.setState({coupons:[response.data.coupon],'couponverify':true});
                    // }else{
                    //     self.setState({couponlimiterroramount:amount,couponlimiterror:true});
                    //     input.addClass('error');
                    //     setTimeout(function(){
                    //         input.removeClass('error');
                    //         input.val('');
                    //         input.attr('disabled',false);
                    //     },1000);
                    //     setTimeout(function(){
                    //         self.setState({couponlimiterror:false});
                    //     },7000);
                    // }
                }else if(response.status=='1358'){
                    input.addClass('error');
                    self.setState({couponerror:iprops.cart.youarenotallowedtousethisgiftcard+'.'});
                    setTimeout(function(){input.removeClass('error');input.val('');input.attr('disabled',false);self.setState({couponerror:'',coupon:''});},3000);
                }else{
                    input.addClass('error');
                    input.val(iprops.cart.doesnotexistorhasexpired+'.');
                    setTimeout(function(){input.removeClass('error');input.val('');input.attr('disabled',false);self.setState({coupon:''});},1000);
                }
                btn.removeClass('pending');
            });
        }
        // for (const [offerkey, offervalue] of Object.entries(self.props.coupons)){
        //     if(self.state.coupon && offervalue.code==self.state.coupon && offervalue.type=='cart'){
        //     offer=true;
        //     }
        // }
        // if(offer){
        //     self.setState({'couponverify':true});
        // }else{
        //     input.addClass('error');
        //     if(self.state.coupon!=''){
        //     input.attr('disabled',true);
        //     input.val('وجود ندارد یا منقضی شده.');
        //     }           
        //     setTimeout(function(){input.removeClass('error');input.val('');input.attr('disabled',false);},1000);
        // }
    }
    changeCouponCode(e){
        let coupon=e.target.value.trim();
        this.setState({coupon:coupon});
    }
    render(){
    const iprops=translate[this.props.locale]
    let endprice=0;
    let endoffer=0;
    let self=this;
    // let path=this.props.location.pathname;
    let proCount=0;
    let encodeUrl=(str)=>{return str.replace(/ /g,'-')}
    let customproducts=cookies.get('customproducts') || false;
    let products=cookies.get('products') || false;
    let carthascustomsew=false;
    let productscount=0;
    if(products){
        Object.values(products.products).map(function(item,i){if(item){productscount++;if(item.customsew){carthascustomsew=true;}}});
    }
    console.log(productscount);
    let cartkey=0;
    moment.loadPersian({usePersianDigits:true});
    let postinghours=(<React.Fragment><option>۱۰ الی ۱۲</option><option>۱۲ الی ۱۴</option><option>۱۴ الی ۱۶</option><option>تحویل فوری</option></React.Fragment>);
    let cartresultcoupon=(<div className="cartresultcoupon">
    <div className="input"><label>{iprops.dashboard.couponcode}</label><input type="text" defaultValue={self.state.coupon} disabled={self.state.couponverify} className={`cartresultcouponinput${self.state.couponverify ? ' success' : ''}`} onKeyPress={this.onKeyPressCouponCode} onChange={this.changeCouponCode.bind(this)} placeholder={`${iprops.cart.entercoupon}.`}/></div>
    <div className="input"><button onClick={this.checkCoupon} disabled={self.state.couponverify} className="mx-0 my-0 cartresultcouponsubmit">{self.state.couponverify ? iprops.cart.applied : iprops.cart.applydiscount}</button></div>
    </div>);
    return (
        <div className="icart">
            <div className={`icartHeader${this.state.step == 1 ? ('') : (' active')}`}>
            <div className="icicons noselect">
                <div className={`icicon${this.state.step == 1 ? (' active') : ('')}`}>
                    <div className="iciconimg"><img alt="cart" src="/img/icon-cart.svg"/></div>
                    <h5>{iprops.cart.title}</h5>
                </div>
                <div className={`icicon${this.state.step == 2 || this.state.step == 3 ? (' active') : ('')}`}>
                    <div className="iciconimg"><img alt="location" src="/img/icon-location.svg"/></div>
                    <h5>{iprops.cart.postinfo}</h5>
                </div>
                <div className={`icicon${this.state.step == 4 || this.state.step == 5 ? (' active') : ('')}`}>
                    <div className="iciconimg"><img alt="pay" src="/img/icon-pay.svg"/></div>
                    <h5>{iprops.cart.paymentinfo}</h5>
                </div>
                </div>
            </div>
            {this.state.step==1 &&
            <div className="icartBody">
            {products ? Object.values(products.products.reverse()).map(function(item,i){
                if(item){
                    cartkey++;
                    let itemoffer=0;
                    let hadoffer=false;
                    if(item.offerid){
                        for (const [offerkey, offervalue] of Object.entries(self.props.coupons)){
                            if(offervalue.id==item.offerid){
                            hadoffer=true;
                            let diff=(item.amount-item.offerprice)*item.count;
                            endoffer+=diff;
                            itemoffer+=diff;
                            }
                        }
                    }
                    if(self.state.couponverify){
                        for (const [offerkey, offervalue] of Object.entries(self.state.coupons)){
                            if(offervalue.code==self.state.coupon && offervalue.type=='cart'){
                                hadoffer=true;
                                if(offervalue.numtype=='percent'){
                                    let diff=((offervalue.num/100)*item.amount)*item.count;
                                    if(item.offerprice && diff>(item.offerprice*item.count)){
                                        diff=item.offerprice*item.count;
                                    }
                                    endoffer+=diff;
                                    itemoffer+=diff;
                                }else{
                                    let diff=(offervalue.num/productscount);
                                    if(item.offerprice && diff>(item.offerprice*item.count)){
                                        diff=item.offerprice;
                                    }
                                    endoffer+=diff;
                                    itemoffer+=diff;
                                }
                            }
                        }
                    }
                    for (const [key, value] of Object.entries(self.state.products)){
                        if(value.id===item.id){
                            endprice+=(parseInt(item.amount)*item.count);
                            proCount+=parseInt(item.count);
                            let brandname='';
                            if(self.props.designers){
                                self.props.designers.forEach(function(item,i){
                                    if(value.designer==item.id){
                                        brandname=item.brand;
                                    }
                                });
                            }
                            return (<div className={`icartrow icartrow-${cartkey}`} key={`icartrow-${cartkey}`}>
                            <div className="icartimg"><div className="icartdeleter" onClick={()=>self.countdeleter(value.id,item.color,item.size,cartkey)}></div><img src={item.img} title={value.title} alt={value.title} /></div>
                            <div className="icartside" style={{backgroundColor:item.customsew ? '#fce4e0' : '#f9f9f9'}}>
                                <div className="icartinfo">
                                    <span>{brandname}</span>
                                    <h5><Link href={`/product-${value.id}/${encodeUrl(value.title)}#${item.color}`}><a style={{color:'#237'}}>{value.title}</a></Link>{item.customsew ? ' ('+iprops.cart.customized+')' : null}</h5>
                                    <span> {iprops.cart.color}: {item.colortitle}{!item.customsew ? (`، ${iprops.cart.size}: ${item.size=='FREE' ? (iprops.cart.onesize) : item.size=='فری سایز' ? 'FREE' : item.size}`) : (`، ${iprops.cart.productid}: ${item.color}`)}</span>
                                    <span>{!item.customsew ? (`${iprops.cart.productid}: ${item.color}`) : item.customsew.map(function(arr,arri){if(arri!=0){let arrslice='، ';if((arri+1)==item.customsew.length){arrslice='';}return (<b>{arr[0]+': '+self.toEnglishDigits(arr[1])+arrslice}</b>);}})}</span>
                                </div>
                                <div className="icartprices">
                                    <div className="icprow">
                                        <div className="icpbox"><span>{iprops.dashboard.count}:</span><div className="countcontroller"><div onClick={(e)=>self.countupper(value.id,item.color,item.size,cartkey,e)} className="countupper noselect">+</div><input typoe="text" disabled value={item.count}/><div className="countdowner noselect" onClick={()=>self.countdowner(value.id,item.color,item.size,cartkey)}>-</div></div></div>
                                        <div className="icpbox"><span>{iprops.cart.unitprice}:</span><span>{self.props.locale=='en' ? self.mulababy(false)+' ' : ''}<b>{self.mulababy(item.amount,true)}</b>{self.props.locale!='en' ? ' '+self.mulababy(false) : ''}</span></div>
                                    </div>
                                    <div className="icpbox"><span>{iprops.dashboard.finalamount}:</span>{hadoffer ? (<span>{self.props.locale=='en' ? self.mulababy(false)+' ' : ''}<b>{self.mulababy((item.amount*item.count)-itemoffer,true)}</b>{self.props.locale!='en' ? ' '+self.mulababy(false) : ''}</span>) : null}<span>{self.props.locale=='en' ? self.mulababy(false)+' ' : ''}<b className="thisfinal">{self.mulababy(item.amount*item.count,true)}</b>{self.props.locale!='en' ? ' '+self.mulababy(false) : ''}</span></div>
                                </div>
                            </div>
                            </div>);
                        }
                    }
                
                }
            }) : ('')}
            {endprice != 0 ? (<React.Fragment>
            {self.state.couponerror!='' ? (<div className="alertMessage animated fadeIn error alertMessage-coupon alertMessage-coupon-desktop">{self.state.couponerror}</div>) : null}
            {/* {self.state.couponlimiterror ? (<div className="alertMessage animated fadeIn error alertMessage-coupon alertMessage-coupon-desktop">مبلغ تخفیف مورد نظر از جمع سفارش شما بیشتر است، آن را به <span>{self.numberWithCommas(self.state.couponlimiterroramount)}</span> تومان افزایش دهید و مجددا امتحان کنید.</div>) : ''} */}
            <div className="cartresult">
            {cartresultcoupon}
            <div className="cartresultright">
                <div className="cartresulticon">
                    <img alt="tru" src="/img/trustitem4.svg"/>
                    <h5>{iprops.cart.freedelivery}</h5>
                </div>
                {/* <div className="cartresulticon">
                    <img src="/img/trustitem1.svg"/>
                    <h5>ارائه کالای با اصالت</h5>
                </div> */}
                <div className="cartresulticon">
                    <img alt="tru" src="/img/trustitem2.svg"/>
                    <h5>{iprops.cart.perudoor}</h5>
                </div>
            </div>
            <div className="cartresultleft">
            <div className="icpbox"><span>{iprops.cart.taxation}:</span><span>{self.props.locale=='en' ? self.mulababy(false)+' ' : ''}<b>{self.numberWithCommas(0)}</b>{self.props.locale!='en' ? ' '+self.mulababy(false) : ''}</span></div>
            <div className="icpbox"><span>{iprops.cart.shippingcost}:</span><span>{self.props.locale=='en' ? self.mulababy(false)+' ' : ''}<b>{self.numberWithCommas(0)}</b>{self.props.locale!='en' ? ' '+self.mulababy(false) : ''}</span></div>
            {endoffer!=0 ? (<div className="icpbox"><span>{iprops.cart.discount}:</span><span>{self.props.locale=='en' ? self.mulababy(false)+' ' : ''}<b>{self.mulababy(endoffer,true)}</b>{self.props.locale!='en' ? ' '+self.mulababy(false) : ''}</span></div>) : ('')}
            <div className="icpbox"><span>{iprops.cart.ordertotal}:</span><span>{self.props.locale=='en' ? self.mulababy(false)+' ' : ''}<b>{self.mulababy(endprice-endoffer,true)}</b>{self.props.locale!='en' ? ' '+self.mulababy(false) : ''}</span></div>
            </div>
            </div>
            <div className="icartcoupon-responsive">
            {self.state.couponerror!='' ? (<div className="alertMessage animated fadeIn error alertMessage-coupon alertMessage-coupon-responsive">{self.state.couponerror}</div>) : null}
            {/* {self.state.couponlimiterror ? (<div className="alertMessage animated fadeIn error alertMessage-coupon alertMessage-coupon-responsive">مبلغ تخفیف مورد نظر از جمع سفارش شما بیشتر است، آن را به <span>{self.numberWithCommas(self.state.couponlimiterroramount)}</span> تومان افزایش دهید و مجددا امتحان کنید.</div>) : ''} */}
            {cartresultcoupon}
            </div>

            <div className="cartresult-mobile">
                <div className="cartresultrow"><span>{iprops.cart.productsinthecart}</span><span>{proCount} {iprops.cart.pieces}</span></div>
                <div className="cartresultrow cartresult-amount" data-value={endprice-endoffer}><span>{iprops.cart.totalamountpayable}</span><span>{self.props.locale=='en' ? self.mulababy(false)+' ' : ''}<b>{self.mulababy(endprice-endoffer,true)}</b>{self.props.locale!='en' ? ' '+self.mulababy(false) : ''}</span></div>
            </div>

            
            <div className="btn nextstep" onClick={()=>this.step2Cart(endprice-endoffer)}>{iprops.cart.nextstep}</div></React.Fragment>) : (<div>{this.state.products ? (<div className="noncart">{iprops.cart.emptycart}.</div>) : (<div className="noncart noncartloading">{iprops.processing} ...</div>)}</div>)
            }


            </div>
            }
            {this.state.step==2 &&

            <div className="icartBody">
{this.state.isLogined ? (
    <div className="icartinformation">

    <div className="input"><label>{iprops.cart.recipientfullname}</label><input type="text" defaultValue={this.state.userData.fullname} className="icart-input-fullname" onChange={(e)=>this.setState({fullname:e.target.value})} placeholder={iprops.cart.recipientfullname}/></div>
    <div className="input"><label>{iprops.cart.contactnumber}</label><input type="text" defaultValue={this.state.userData.userphone} className="icart-input-userphone" onChange={(e)=>this.setState({userphone:e.target.value})} placeholder={iprops.cart.contactnumber}/></div>
    <div className="input"><label>{iprops.dashboard.postalcode}</label><input type="text" defaultValue={this.state.userData.postcode} className="icart-input-postcode" onChange={(e)=>this.setState({postcode:e.target.value})} placeholder={iprops.dashboard.postalcode}/></div>
    {this.props.locale=='fa' ? <div className="input"><label>{iprops.dashboard.state}</label><select value={this.state.state} onChange={(e) => this.setState({state:e.target.value})} className="icart-input-state">
    <option value="">{iprops.dashboard.state}</option>
    <option value="تهران">تهران</option>
    <option value="گیلان">گیلان</option>
    <option value="آذربایجان شرقی">آذربایجان شرقی</option>
    <option value="خوزستان">خوزستان</option>
    <option value="فارس">فارس</option>
    <option value="اصفهان">اصفهان</option>
    <option value="خراسان رضوی">خراسان رضوی</option>
    <option value="قزوین">قزوین</option>
    <option value="سمنان">سمنان</option>
    <option value="قم">قم</option>
    <option value="مرکزی">مرکزی</option>
    <option value="زنجان">زنجان</option>
    <option value="مازندران">مازندران</option>
    <option value="گلستان">گلستان</option>
    <option value="اردبیل">اردبیل</option>
    <option value="آذربایجان غربی">آذربایجان غربی</option>
    <option value="همدان">همدان</option>
    <option value="کردستان">کردستان</option>
    <option value="کرمانشاه">کرمانشاه</option>
    <option value="لرستان">لرستان</option>
    <option value="بوشهر">بوشهر</option>
    <option value="کرمان">کرمان</option>
    <option value="هرمزگان">هرمزگان</option>
    <option value="چهارمحال و بختیاری">چهارمحال و بختیاری</option>
    <option value="یزد">یزد</option>
    <option value="سیستان و بلوچستان">سیستان و بلوچستان</option>
    <option value="ایلام">ایلام</option>
    <option value="کهگلویه و بویراحمد">کهگلویه و بویراحمد</option>
    <option value="خراسان شمالی">خراسان شمالی</option>
    <option value="خراسان جنوبی">خراسان جنوبی</option>
    <option value="البرز">البرز</option>
    </select></div> : (<div className="input"><label>{iprops.dashboard.country}</label><input type="text" className="icart-input-state" onChange={(e)=>this.setState({fixphone:e.target.value})} placeholder={iprops.dashboard.country}/></div>)}
    {this.props.locale=='fa' ? <div className="input"><label>{iprops.dashboard.city}</label><select value={this.state.city} className="icart-input-city" onChange={(e) => this.setState({city:e.target.value})}><City ustan={this.state.state}/></select></div> : (<div className="input"><label>{iprops.dashboard.city}</label><input type="text" className="icart-input-city" onChange={(e)=>this.setState({fixphone:e.target.value})} placeholder={iprops.dashboard.city}/></div>)}
    <div className="input"><label>{iprops.cart.fixednumber}</label><input type="text" className="icart-input-fixphone" onChange={(e)=>this.setState({fixphone:e.target.value})} placeholder={iprops.cart.fixednumber}/></div>
    <div className="input w-max"><label>{iprops.dashboard.postaladdress}</label><textarea defaultValue={this.state.userData.address} className="icart-input-address" onChange={(e)=>this.setState({address:e.target.value})} placeholder={iprops.dashboard.postaladdress}></textarea></div>
    <div className="input w-max btnstoleft">
    <a className="btn" onClick={this.step3Cart}>{iprops.cart.nextstep}</a>
    <a className="btn btn-nofill" onClick={this.step1Cart}>{iprops.back}</a>
    </div>

    </div>
) : (<Login checkLogin={this.checkLogin} parent="cart"/>)}

            </div>

            }
            {this.state.step==3 &&
            <div className="icartRow">
                <div className="icartCol">
                    <h5>{iprops.cart.yourorderwillbesenttothefollowingaddressanddetails}:</h5>
                    <div className="input"><label>{iprops.firstnameandlastname}</label><p>{this.state.fullname||this.state.userData.fullname}</p></div>
                    <div className="input"><label>{iprops.dashboard.address}</label><p>{this.state.address||this.state.userData.address}</p></div>
                    <div className="input"><label>{iprops.gift.mobilenumber}</label><p>{this.state.userphone||this.state.userData.userphone}</p></div>
                    <div className="input"><label>{iprops.cart.shippingcost}</label><p>{iprops.cart.free}</p></div>
                </div>
                <div className="icartCol">
                {carthascustomsew ? (<p style={{marginBottom:15+'px'}}>{iprops.cart.duetothecustomizedproductinyourshoppingcartyoucannot}.</p>) : null}
                <div className="icartRadios">
                <div className="icartRadio"><input defaultChecked={!carthascustomsew} type="radio" name="payin" id="payincard" value="card" onChange={this.payinchoose} /><label htmlFor="payincard"><span></span>{iprops.cart.onlinepayment}</label></div>
                <div className="icartRadio">{carthascustomsew || self.state.state!='تهران' ? (<input disabled={true} type="radio" name="payin" id="payinhome" value="home" />) : (<input type="radio" name="payin" id="payinhome" value="home" onChange={this.payinchoose} />)}<label htmlFor="payinhome"><span></span>{iprops.cart.doortodoorpayment}</label></div>
                </div>
                <div className="input w-max btnstoleft">
                <a className="btn" onClick={this.step5Cart}>{iprops.cart.nextstep}</a>
                <a className="btn btn-nofill" onClick={this.step2Cart}>{iprops.back}</a>
                </div>

                    {/* <h5>زمان ارسال خریدتان را مشخص کنید.</h5>
            <div className="input"><label>تاریخ ارسال</label><select onChange={(e) => this.setState({postingdate:e.target.value})}>{this.state.postingdates.map((value,index)=>{return <option>{value}</option>})}</select></div>
            <div className="input"><label>ساعت ارسال</label><select onChange={(e) => this.setState({postinghour:e.target.value})}>{postinghours}</select></div>
                    <div className="input w-max btnstoleft">
                    <a className="btn" onClick={this.step4Cart}>ثبت و مرحله بعد</a>
                    <a className="btn btn-nofill" onClick={()=>this.step2Cart(0)}>بازگشت</a>
                    </div> */}
                </div>
            </div>
            }
            {this.state.step==4 &&
            <div className="icartRow">
            <div className="icartCol">
                <h5>{iprops.cart.yourorderwillbeshippedatthefollowingtime}:</h5>
                <div className="input"><label>{iprops.cart.postagedate}</label><p>{this.state.postingdate+'، '+this.state.postinghour}</p></div>
                <div className="input"><label>{iprops.cart.ordertotal}</label><p>{self.mulababy(this.state.price)}</p></div>
            </div>
            <div className="icartCol">
                {carthascustomsew ? (<p style={{marginBottom:15+'px'}}>{iprops.cart.duetothecustomizedproductinyourshoppingcartyoucannot}.</p>) : null}
                <div className="icartRadios">
                <div className="icartRadio"><input defaultChecked={!carthascustomsew} type="radio" name="payin" id="payincard" value="card" onChange={this.payinchoose} /><label htmlFor="payincard"><span></span>{iprops.cart.onlinepayment}</label></div>
                <div className="icartRadio">{carthascustomsew || self.state.state!='تهران' ? (<input disabled={true} type="radio" name="payin" id="payinhome" value="home" />) : (<input type="radio" name="payin" id="payinhome" value="home" onChange={this.payinchoose} />)}<label htmlFor="payinhome"><span></span>{iprops.cart.doortodoorpayment}</label></div>
                </div>
                <div className="input w-max btnstoleft">
                <a className="btn" onClick={this.step5Cart}>{iprops.cart.nextstep}</a>
                <a className="btn btn-nofill" onClick={this.step3Cart}>{iprops.back}</a>
                </div>
            </div>
            </div>
            }

            {this.state.step==5 &&
            <div className="container-cafca line-baaz animated fadeIn slow py-0">
                {this.state.payin=='card' & this.state.price!=0 ? (<div className="titlebar">{iprops.cart.transferringtothebankportal}...</div>) : (<div className="titlebar">{iprops.cart.pleasebepatient}...</div>)}
            </div>
            }
            

        </div>
    
    );
    }
  }


class City extends Component {
    constructor(props){
        super(props);
    }
    render(){
        let ustan=this.props.ustan;
        if(!ustan){return(<React.Fragment><option value="">شهر</option><option disabled>ابتدا استان را انتخاب کنید.</option></React.Fragment>);}else{
            if(ustan=='تهران'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>تهران</option>
            <option>احمدآبادمستوفي</option>
            <option>ادران</option>
            <option>اسلام آباد</option>
            <option>اسلام آباد</option>
            <option>اكبرآباد</option>
            <option>اميريه</option>
            <option>انديشه</option>
            <option>اوشان</option>
            <option>آبسرد</option>
            <option>آبعلي</option>
            <option>باغستان</option>
            <option>باقر شهر</option>
            <option>برغان</option>
            <option>بومهن</option>
            <option>پارچين</option>
            <option>پاكدشت</option>
            <option>پرديس</option>
            <option>پرند</option>
            <option>پس قلعه</option>
            <option>پيشوا</option>
            <option>تجزيه مبادلات لشكر</option>
            <option>جاجرود</option>
            <option>چرمسازي سالاريه</option>
            <option>چهاردانگه</option>
            <option>حسن آباد</option>
            <option>حومه گلندوك</option>
            <option>خاتون آباد</option>
            <option>خاوه</option>
            <option>خرمدشت</option>
            <option>جاجرود</option>
            <option>چرمسازي سالاريه</option>
            <option>چهاردانگه</option>
            <option>حسن آباد</option>
            <option>حومه گلندوك</option>
            <option>خاتون آباد</option>
            <option>خاوه</option>
            <option>خرمدشت</option>
            <option>دركه</option>
            <option>دماوند</option>
            <option>رباط كريم</option>
            <option>رزگان</option>
            <option>رودهن</option>
            <option>ري</option>
            <option>سعيدآباد</option>
            <option>سلطان آباد</option>
            <option>سوهانك</option>
            <option>شاهدشهر</option>
            <option>شريف آباد</option>
            <option>شمس آباد</option>
            <option>شهر قدس</option>
            <option>شهرآباد</option>
            <option>شهرجديدپرديس</option>
            <option>شهرقدس(مويز)</option>
            <option>شهريار</option>
            <option>شهرياربردآباد</option>
            <option>صالح آباد</option>
            <option>صفادشت</option>
            <option>فرودگاه امام خميني</option>
            <option>فرون آباد</option>
            <option>فشم</option>
            <option>فيروزكوه</option>
            <option>قرچك</option>
            <option>قيام دشت</option>
            <option>كهريزك</option>
            <option>كيلان</option>
            <option>گلدسته</option>
            <option>گلستان (بهارستان)</option>
            <option>گيلاوند</option>
            <option>لواسان</option>
            <option>لوسان بزرگ</option>
            <option>مارليك</option>
            <option>مروزبهرام</option>
            <option>ملارد</option>
            <option>منطقه 11 پستي تهران</option>
            <option>منطقه 13 پستي تهران</option>
            <option>منطقه 14 پستي تهران</option>
            <option>منطقه 15 پستي تهران</option>
            <option>منطقه 16 پستي تهران</option>
            <option>منطقه 17 پستي تهران</option>
            <option>منطقه 18 پستي تهران</option>
            <option>منطقه 19 پستي تهران</option>
            <option>نسيم شهر (بهارستان)</option>
            <option>نصيرآباد</option>
            <option>واوان</option>
            <option>وحيديه</option>
            <option>ورامين</option>
            <option>وهن آباد</option>
            </React.Fragment>
            );
            }else if(ustan=='گیلان'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>احمد سرگوراب</option>
            <option>اسالم</option>
            <option>اسكلك</option>
            <option>اسلام آباد</option>
            <option>اطاقور</option>
            <option>املش</option>
            <option>آبكنار</option>
            <option>آستارا</option>
            <option>آستانه اشرفيه</option>
            <option>بازاراسالم</option>
            <option>بازارجمعه شاندرمن</option>
            <option>برهسر</option>
            <option>بلترك</option>
            <option>بلسبنه</option>
            <option>بندرانزلي</option>
            <option>پاشاكي</option>
            <option>پرهسر</option>
            <option>پلاسي</option>
            <option>پونل</option>
            <option>پيربست لولمان</option>
            <option>توتكابن</option>
            <option>جوكندان</option>
            <option>چابكسر</option>
            <option>چاپارخانه</option>
            <option>چوبر</option>
            <option>خاچكين</option>
            <option>خشك بيجار</option>
            <option>خطبه سرا</option>
            <option>خمام</option>
            <option>رانكوه</option>
            <option>رحيم آباد</option>
            <option>رستم آباد</option>
            <option>رشت</option>
            <option>رضوان شهر</option>
            <option>رودبار</option>
            <option>رودسر</option>
            <option>سراوان</option>
            <option>سنگر</option>
            <option>سياهكل</option>
            <option>شاندرمن</option>
            <option>شفت</option>
            <option>صومعه سرا</option>
            <option>طاهر گوداب</option>
            <option>طوللات</option>
            <option>فومن</option>
            <option>قاسم آبادسفلي</option>
            <option>كپورچال</option>
            <option>كلاچاي</option>
            <option>كوچصفهان</option>
            <option>كومله</option>
            <option>گشت</option>
            <option>لاهيجان</option>
            <option>لشت نشا</option>
            <option>لنگرود</option>
            <option>لوشان</option>
            <option>لولمان</option>
            <option>لوندويل</option>
            <option>ليسار</option>
            <option>ماسال</option>
            <option>ماسوله</option>
            <option>منجيل</option>
            <option>هشتپر ـ طوالش</option>
            <option>واجارگاه</option>
            </React.Fragment>);
            }else if(ustan=='آذربایجان شرقی'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>ابشاحمد</option>
            <option>اذغان</option>
            <option>اسب فروشان</option>
            <option>اسكو</option>
            <option>اغچه ريش</option>
            <option>اقمنار</option>
            <option>القو</option>
            <option>اهر</option>
            <option>ايلخچي</option>
            <option>آذرشهر</option>
            <option>باسمنج</option>
            <option>بخشايش ـ كلوانق</option>
            <option>بستان آباد</option>
            <option>بناب</option>
            <option>بناب جديد ـ مرند</option>
            <option>تبريز</option>
            <option>ترك</option>
            <option>تسوج</option>
            <option>جلفا</option>
            <option>خامنه</option>
            <option>خداآفرين</option>
            <option>خسروشهر</option>
            <option>خضرلو</option>
            <option>خلجان</option>
            <option>سبلان</option>
            <option>سراب</option>
            <option>سردرود</option>
            <option>سيس</option>
            <option>شادبادمشايخ</option>
            <option>شبستر</option>
            <option>شربيان</option>
            <option>شرفخانه</option>
            <option>شهر جديد سهند</option>
            <option>صوفيان</option>
            <option>شهر جديد سهند</option>
            <option>عجب شير</option>
            <option>قره اغاج ـ چاراويماق</option>
            <option>قره بابا</option>
            <option>كردكندي</option>
            <option>كليبر</option>
            <option>كندرود</option>
            <option>كندوان</option>
            <option>گوگان</option>
            <option>مراغه</option>
            <option>مرند</option>
            <option>ملكان</option>
            <option>ممقان</option>
            <option>ميانه</option>
            <option>هاديشهر</option>
            <option>هريس</option>
            <option>هشترود</option>
            <option>هوراند</option>
            <option>ورزقان</option>
            </React.Fragment>);
            }else if(ustan=='خوزستان'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>اروندكنار</option>
            <option>اميديه</option>
            <option>انديمشك</option>
            <option>اهواز</option>
            <option>ايذه</option>
            <option>آبادان</option>
            <option>آغاجاري</option>
            <option>باغ ملك</option>
            <option>بندرامام خميني</option>
            <option>بهبهان</option>
            <option>جايزان</option>
            <option>جنت مكان</option>
            <option>چمران ـ شهرك طالقاني</option>
            <option>حميديه</option>
            <option>خرمشهر</option>
            <option>دزآب</option>
            <option>دزفول</option>
            <option>دهدز</option>
            <option>رامشير</option>
            <option>رامهرمز</option>
            <option>سربندر</option>
            <option>سردشت</option>
            <option>سماله</option>
            <option>سوسنگرد ـ دشت آزادگان</option>
            <option>شادگان</option>
            <option>شرافت</option>
            <option>شوش</option>
            <option>شوشتر</option>
            <option>شيبان</option>
            <option>صالح مشطت</option>
            <option>كردستان بزرگ</option>
            <option>گتوند</option>
            <option>لالي</option>
            <option>ماهشهر</option>
            <option>مسجد سليمان</option>
            <option>ملاثاني</option>
            <option>ميانكوه</option>
            <option>هفتگل</option>
            <option>هنديجان</option>
            <option>هويزه</option>
            <option>ويس</option>
            </React.Fragment>);
            }else if(ustan=='فارس'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>بيضا</option>
            <option>اردكان ـ سپيدان</option>
            <option>ارسنجان</option>
            <option>استهبان</option>
            <option>اشكنان ـ اهل</option>
            <option>اقليد</option>
            <option>اكبرآبادكوار</option>
            <option>اوز</option>
            <option>ايزدخواست</option>
            <option>آباده</option>
            <option>آباده طشك</option>
            <option>بالاده</option>
            <option>بانش</option>
            <option>بنارويه</option>
            <option>بهمن</option>
            <option>بوانات</option>
            <option></option>
            <option>بيرم</option>
            <option></option>
            <option>جهرم</option>
            <option>جويم</option>
            <option>حاجي آباد ـ زرين دشت</option>
            <option>حسن آباد</option>
            <option>خرامه</option>
            <option>خرمی</option>
            <option>خشت</option>
            <option>خنج</option>
            <option>خيرآبادتوللي</option>
            <option>داراب</option>
            <option>داريان</option>
            <option>دهرم</option>
            <option>رونيز</option>
            <option>زاهدشهر</option>
            <option>زرقان</option>
            <option>سروستان</option>
            <option>سعادت شهر ـ پاسارگاد</option>
            <option>سيدان</option>
            <option>ششده</option>
            <option>شهر جديد صدرا</option>
            <option>شيراز</option>
            <option>صغاد</option>
            <option>صفاشهر ـ خرم بيد</option>
            <option>طسوج</option>
            <option>علاءمرودشت</option>
            <option>فدامي</option>
            <option>فراشبند</option>
            <option>فسا</option>
            <option>فيروزآباد</option>
            <option>فيشور</option>
            <option>قادرآباد</option>
            <option>قائميه</option>
            <option>قطب آباد</option>
            <option>قطرويه</option>
            <option>قير و كارزين</option>
            <option>كازرون</option>
            <option>كام فيروز</option>
            <option>كلاني</option>
            <option>كنارتخته</option>
            <option>كوار</option>
            <option>گراش</option>
            <option>گويم</option>
            <option>لار ـ لارستان</option>
            <option>لامرد</option>
            <option>مبارك آباد</option>
            <option>مرودشت</option>
            <option>مشكان</option>
            <option>مصيري ـ رستم</option>
            <option>مظفري</option>
            <option>مهر</option>
            <option>ميمند</option>
            <option>نورآباد ـ ممسني</option>
            <option>ني ريز</option>
            <option>وراوي</option>
            </React.Fragment>);
            }else if(ustan=='اصفهان'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>ابريشم</option>
            <option>ابوزيدآباد</option>
            <option>اردستان</option>
            <option>اريسمان</option>
            <option>اژيه</option>
            <option>اسفرجان</option>
            <option>اسلام آباد</option>
            <option>اشن</option>
            <option>اصغرآباد</option>
            <option>اصفهان</option>
            <option>امين آباد</option>
            <option>ايمان شهر</option>
            <option>آران وبيدگل</option>
            <option>بادرود</option>
            <option>باغ بهادران</option>
            <option>بهارستان</option>
            <option>بوئين ومياندشت</option>
            <option>پيربكران</option>
            <option>تودشك</option>
            <option>تيران</option>
            <option>جعفرآباد</option>
            <option>جندق</option>
            <option>جوجيل</option>
            <option>چادگان</option>
            <option>چرمهين</option>
            <option>چمگردان</option>
            <option>حسن اباد</option>
            <option>خالدآباد</option>
            <option>خميني شهر</option>
            <option>خوانسار</option>
            <option>خوانسارك</option>
            <option>خور</option>
            <option>خوراسگان</option>
            <option>خورزوق</option>
            <option>داران ـ فريدن</option>
            <option>درچه پياز</option>
            <option>دستگردوبرخوار</option>
            <option>دهاقان</option>
            <option>دهق</option>
            <option>دولت آباد</option>
            <option>ديزيچه</option>
            <option>رزوه</option>
            <option>رضوان شهر</option>
            <option>رهنان</option>
            <option>زاينده رود</option>
            <option>زرين شهر ـ لنجان</option>
            <option>زواره</option>
            <option>زيار</option>
            <option>زيبا شهر</option>
            <option>سپاهان شهر</option>
            <option>سده لنجان</option>
            <option>سميرم</option>
            <option>شاهين شهر</option>
            <option>شهرضا</option>
            <option>شهرك صنعتي مورچ</option>
            <option>شهرك مجلسي</option>
            <option>شهرک صنعتي محمودآباد</option>
            <option>طالخونچه</option>
            <option>عسگران</option>
            <option>علويچه</option>
            <option>غرغن</option>
            <option>فرخي</option>
            <option>فريدون شهر</option>
            <option>فلاورجان</option>
            <option>فولادشهر</option>
            <option>فولادمباركه</option>
            <option>قهد ريجان</option>
            <option>كاشان</option>
            <option>كليشادوسودرجان</option>
            <option>كمشچه</option>
            <option>كوهپايه</option>
            <option>گز</option>
            <option>گلپايگان</option>
            <option>گلدشت</option>
            <option>گلشهر</option>
            <option>گوگد</option>
            <option>مباركه</option>
            <option>مهاباد</option>
            <option>مورچه خورت</option>
            <option>ميمه</option>
            <option>نائين</option>
            <option>نجف آباد</option>
            <option>نصر آباد</option>
            <option>نطنز</option>
            <option>نيك آباد</option>
            <option>بهارستان</option>
            <option>هرند</option>
            <option>ورزنه</option>
            <option>ورنامخواست</option>
            <option>ویلاشهر</option>
            </React.Fragment>);
            }else if(ustan=='خراسان رضوی'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>ابدال آباد</option>
            <option>ازادوار</option>
            <option>باجگيران</option>
            <option>باخرز</option>
            <option>باسفر</option>
            <option>بجستان</option>
            <option>بردسكن</option>
            <option>برون</option>
            <option>بزنگان</option>
            <option>بند قرائ</option>
            <option>بيدخت</option>
            <option>تايباد</option>
            <option>تربت جام</option>
            <option>تربت حيدريه</option>
            <option>جغتاي</option>
            <option>جنگل</option>
            <option>چمن آباد</option>
            <option>چناران</option>
            <option>خليل آباد</option>
            <option>خواف</option>
            <option>داورزن</option>
            <option>درگز</option>
            <option>دولت آباد ـ زاوه</option>
            <option>رادكان</option>
            <option>رشتخوار</option>
            <option>رضويه</option>
            <option>ريوش(كوهسرخ)</option>
            <option>سبزوار</option>
            <option>سرخس</option>
            <option>سلطان آباد</option>
            <option>سنگان</option>
            <option>شانديز</option>
            <option>صالح آباد</option>
            <option>طرقبه ـ بينالود</option>
            <option>طوس سفلي</option>
            <option>فريمان</option>
            <option>فيروزه ـ تخت جلگه</option>
            <option>فيض آباد ـ مه ولات</option>
            <option>قاسم آباد</option>
            <option>قدمگاه</option>
            <option>قوچان</option>
            <option>كاخك</option>
            <option>كاشمر</option>
            <option>كلات</option>
            <option>گلبهار</option>
            <option>گناباد</option>
            <option>لطف آباد</option>
            <option>مشهد</option>
            <option>مشهدريزه</option>
            <option>مصعبي</option>
            <option>نشتيفان</option>
            <option>نقاب ـ جوين</option>
            <option>نيشابور</option>
            <option>نيل شهر</option>
            </React.Fragment>);
            }else if(ustan=='قزوین'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>َآوج</option>
            <option>ارداق</option>
            <option>اسفرورين</option>
            <option>اقباليه</option>
            <option>الوند ـ البرز</option>
            <option>آبگرم</option>
            <option>آبيك</option>
            <option>آقابابا</option>
            <option>بوئين زهرا</option>
            <option>بیدستان</option>
            <option>تاكستان</option>
            <option>حصاروليعصر</option>
            <option>خاكعلي</option>
            <option>خرم دشت</option>
            <option>دانسفهان</option>
            <option>سيردان</option>
            <option>شال</option>
            <option>شهر صنعتي البرز</option>
            <option>ضياآباد</option>
            <option>قزوين</option>
            <option>ليا</option>
            <option>محمديه</option>
            <option>محمود آباد نمونه</option>
            <option>معلم كلايه</option>
            <option>نرجه</option>
            </React.Fragment>);
            }else if(ustan=='سمنان'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>ارادان</option>
            <option>اميريه</option>
            <option>ايوانكي</option>
            <option>بسطام</option>
            <option>بيارجمند</option>
            <option>خيرآباد</option>
            <option>دامغان</option>
            <option>درجزين</option>
            <option>سرخه</option>
            <option>سمنان</option>
            <option>شاهرود</option>
            <option>شهميرزاد</option>
            <option>گرمسار</option>
            <option>مجن</option>
            <option>مهدي شهر</option>
            <option>ميامي</option>
            <option>ميغان</option>
            </React.Fragment>);
            }else if(ustan=='قم'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>دستجرد</option>
            <option>سلفچگان</option>
            <option>شهر جعفریه</option>
            <option>قم</option>
            <option>قنوات</option>
            <option>كهك</option>
            </React.Fragment>);
            }else if(ustan=='مرکزی'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>اراك</option>
            <option>آستانه</option>
            <option>آشتيان</option>
            <option>تفرش</option>
            <option>توره</option>
            <option>جاورسيان</option>
            <option>خسروبيك</option>
            <option>خشك رود</option>
            <option>خمين</option>
            <option>خنداب</option>
            <option>دليجان</option>
            <option>ريحان عليا</option>
            <option>زاويه</option>
            <option>ساوه</option>
            <option>شازند</option>
            <option>شهراب</option>
            <option>شهرك مهاجران</option>
            <option>فرمهين</option>
            <option>كميجان</option>
            <option>مامونيه ـ زرنديه</option>
            <option>محلات</option>
            <option>ميلاجرد</option>
            <option>هندودر</option>
            </React.Fragment>);
            }else if(ustan=='زنجان'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>آب بر ـ طارم</option>
            <option>ابهر</option>
            <option>اسفجين</option>
            <option>پري</option>
            <option>حلب</option>
            <option>خرمدره</option>
            <option>دستجرده</option>
            <option>دندي</option>
            <option>زرين آباد ـ ايجرود</option>
            <option>زرين رود</option>
            <option>زنجان</option>
            <option>سلطانيه</option>
            <option>صائين قلعه</option>
            <option>قيدار</option>
            <option>گرماب</option>
            <option>گيلوان</option>
            <option>ماهنشان</option>
            <option>همايون</option>
            <option>هيدج</option>
            </React.Fragment>);
            }else if(ustan=='مازندران'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>اسلام آباد</option>
            <option>اميركلا</option>
            <option>ايزدشهر</option>
            <option>آمل</option>
            <option>آهنگركلا</option>
            <option>بابل</option>
            <option>بابلسر</option>
            <option>بلده</option>
            <option>بهشهر</option>
            <option>بهنمير</option>
            <option>پل سفيد ـ سوادكوه</option>
            <option>تنكابن</option>
            <option>جويبار</option>
            <option>چالوس</option>
            <option>چمستان</option>
            <option>خرم آباد</option>
            <option>خوشرودپی</option>
            <option>رامسر</option>
            <option>رستم كلا</option>
            <option>رويانشهر</option>
            <option>زاغمرز</option>
            <option>زرگر محله</option>
            <option>زيرآب</option>
            <option>سادات محله</option>
            <option>ساري</option>
            <option>سرخرود</option>
            <option>سلمانشهر</option>
            <option>سنگده</option>
            <option>سوا</option>
            <option>سورك</option>
            <option>شيرگاه</option>
            <option>شيرود</option>
            <option>عباس آباد</option>
            <option>فريدون كنار</option>
            <option>قائم شهر</option>
            <option>كلارآباد</option>
            <option>كلاردشت</option>
            <option>كيا كلا</option>
            <option>كياسر</option>
            <option>گزنك</option>
            <option>گلوگاه</option>
            <option>گهرباران</option>
            <option>محمودآباد</option>
            <option>مرزن آباد</option>
            <option>مرزي كلا</option>
            <option>نشتارود</option>
            <option>نكاء</option>
            <option>نور</option>
            <option>نوشهر</option>
            </React.Fragment>);
            }else if(ustan=='گلستان'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>انبار آلوم</option>
            <option>اينچه برون</option>
            <option>آزادشهر</option>
            <option>آق قلا</option>
            <option>بندر گز</option>
            <option>بندرتركمن</option>
            <option>جلين</option>
            <option>خان ببين</option>
            <option>راميان</option>
            <option>سيمين شهر</option>
            <option>علي آباد</option>
            <option>فاضل آباد</option>
            <option>كردكوي</option>
            <option>كلاله</option>
            <option>گاليكش</option>
            <option>گرگان</option>
            <option>گميش تپه</option>
            <option>گنبدكاوس</option>
            <option>مراوه تپه</option>
            <option>مينودشت</option>
            </React.Fragment>);
            }else if(ustan=='اردبیل'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>ابي بيگلو</option>
            <option>اردبيل</option>
            <option>اصلاندوز</option>
            <option>بيله سوار</option>
            <option>پارس آباد</option>
            <option>تازه كند انگوت</option>
            <option>جعفرآباد</option>
            <option>خلخال</option>
            <option>سرعين</option>
            <option>شهرك شهيد غفاري</option>
            <option>كلور</option>
            <option>كوارئيم</option>
            <option>گرمي</option>
            <option>گيوي ـ كوثر</option>
            <option>لاهرود</option>
            <option>مشگين شهر</option>
            <option>نمين</option>
            <option>نير</option>
            <option>هشتجين</option>
            </React.Fragment>);
            }else if(ustan=='آذربایجان غربی'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>اروميه</option>
            <option>اشنويه</option>
            <option>ايواوغلي</option>
            <option>بازرگان</option>
            <option>بوكان</option>
            <option>پسوه</option>
            <option>پلدشت</option>
            <option>پيرانشهر</option>
            <option>تازه شهر</option>
            <option>تكاب</option>
            <option>چهاربرج قديم</option>
            <option>خوي</option>
            <option>ديزج</option>
            <option>ديزجديز</option>
            <option>ربط</option>
            <option>زيوه</option>
            <option>سردشت</option>
            <option>سلماس</option>
            <option>سيلوانا</option>
            <option>سيلوه</option>
            <option>سيه چشمه ـ چالدران</option>
            <option>شاهين دژ</option>
            <option>شوط</option>
            <option>قره ضياء الدين ـ چايپاره</option>
            <option>قوشچي</option>
            <option>كشاورز (اقبال)</option>
            <option>ماكو</option>
            <option>محمد يار</option>
            <option>محمودآباد</option>
            <option>مهاباد</option>
            <option>مياندوآب</option>
            <option>مياوق</option>
            <option>ميرآباد</option>
            <option>نقده</option>
            <option>نوشين شهر</option>
            </React.Fragment>);
            }else if(ustan=='همدان'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>ازندريان</option>
            <option>اسدآباد</option>
            <option>اسلام آباد</option>
            <option>بهار</option>
            <option>پايگاه نوژه</option>
            <option>تويسركان</option>
            <option>دمق</option>
            <option>رزن</option>
            <option>سامن</option>
            <option>سركان</option>
            <option>شيرين سو</option>
            <option>صالح آباد</option>
            <option>فامنين</option>
            <option>قروه درجزين</option>
            <option>قهاوند</option>
            <option>كبودرآهنگ</option>
            <option>گيان</option>
            <option>لالجين</option>
            <option>ملاير</option>
            <option>نهاوند</option>
            <option>همدان</option>
            </React.Fragment>);
            }else if(ustan=='کردستان'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>اورامانتخت</option>
            <option>بانه</option>
            <option>بلبان آباد</option>
            <option>بيجار</option>
            <option>دلبران</option>
            <option>دهگلان</option>
            <option>ديواندره</option>
            <option>سروآباد</option>
            <option>سريش آباد</option>
            <option>سقز</option>
            <option>سنندج</option>
            <option>قروه</option>
            <option>كامياران</option>
            <option>مريوان</option>
            <option>موچش</option>
            </React.Fragment>);
            }else if(ustan=='کرمانشاه'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>اسلام آباد غرب</option>
            <option>باينگان</option>
            <option>بيستون</option>
            <option>پاوه</option>
            <option>تازه آباد ـ ثلاث باباجاني</option>
            <option>جوانرود</option>
            <option>روانسر</option>
            <option>ريجاب</option>
            <option>سراب ذهاب</option>
            <option>سرپل ذهاب</option>
            <option>سنقر</option>
            <option>صحنه</option>
            <option>فرامان</option>
            <option>فش</option>
            <option>قصرشيرين</option>
            <option>كرمانشاه</option>
            <option>كنگاور</option>
            <option>گيلانغرب</option>
            <option>نودشه</option>
            <option>هرسين</option>
            <option>هلشي</option>
            </React.Fragment>);
            }else if(ustan=='لرستان'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>ازنا</option>
            <option>الشتر ـ سلسله</option>
            <option>اليگودرز</option>
            <option>برخوردار</option>
            <option>بروجرد</option>
            <option>پل دختر</option>
            <option>تقي آباد</option>
            <option>چغلوندی</option>
            <option>چقابل</option>
            <option>خرم آباد</option>
            <option>دورود</option>
            <option>زاغه</option>
            <option>سپيددشت</option>
            <option>شول آباد</option>
            <option>كوناني</option>
            <option>كوهدشت</option>
            <option>معمولان</option>
            <option>نورآباد ـ دلفان</option>
            <option>واشيان نصيرتپه</option>
            </React.Fragment>);
            }else if(ustan=='بوشهر'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>ابدان</option>
            <option>اهرم ـ تنگستان</option>
            <option>آباد</option>
            <option>آبپخش</option>
            <option>بادوله</option>
            <option>برازجان ـ دشتستان</option>
            <option>بردخون</option>
            <option>بندردير</option>
            <option>بندرديلم</option>
            <option>بندرريگ</option>
            <option>بندركنگان</option>
            <option>بندرگناوه</option>
            <option>بوشهر</option>
            <option>تنگ ارم</option>
            <option>جزيره خارك</option>
            <option>جم</option>
            <option>چغارك</option>
            <option>خورموج ـ دشتي</option>
            <option>دلوار</option>
            <option>ريز</option>
            <option>سعدآباد</option>
            <option>شبانكاره</option>
            <option>شنبه</option>
            <option>شول</option>
            <option>عالی شهر</option>
            <option>عسلويه</option>
            <option>كاكي</option>
            <option>كلمه</option>
            <option>نخل تقي</option>
            <option>وحدتيه</option>
            </React.Fragment>);
            }else if(ustan=='کرمان'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>اختيارآباد</option>
            <option>ارزوئیه</option>
            <option>امين شهر</option>
            <option>انار</option>
            <option>باغين</option>
            <option>بافت</option>
            <option>بردسير</option>
            <option>بلوك</option>
            <option>بم</option>
            <option>بهرمان</option>
            <option>پاريز</option>
            <option>جواديه فلاح</option>
            <option>جوشان</option>
            <option>جيرفت</option>
            <option>چترود</option>
            <option>خانوك</option>
            <option>دوساري</option>
            <option>رابر</option>
            <option>راور</option>
            <option>راين</option>
            <option>رفسنجان</option>
            <option>رودبار</option>
            <option>ريگان</option>
            <option>زرند</option>
            <option>زنگي آباد</option>
            <option>سرچشمه</option>
            <option>سريز</option>
            <option>سيرجان</option>
            <option>شهربابك</option>
            <option>صفائيه</option>
            <option>عنبرآباد</option>
            <option>فارياب</option>
            <option>فهرج</option>
            <option>قلعه گنج</option>
            <option>كاظم آباد</option>
            <option>كرمان</option>
            <option>كهنوج</option>
            </React.Fragment>);
            }else if(ustan=='هرمزگان'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>ابوموسي</option>
            <option>ايسين</option>
            <option>بستك</option>
            <option>بندرخمير</option>
            <option>بندرعباس</option>
            <option>بندرلنگه</option>
            <option>بندزك كهنه</option>
            <option>پارسيان</option>
            <option>پدل</option>
            <option>پل شرقي</option>
            <option>تياب</option>
            <option>جاسك</option>
            <option>جزيره سيري</option>
            <option>جزيره لاوان</option>
            <option>جزيره هنگام</option>
            <option>جزيرهلارك</option>
            <option>جناح</option>
            <option>چارك</option>
            <option>حاجي آباد</option>
            <option>درگهان</option>
            <option>دشتي</option>
            <option>دهبارز ـ رودان</option>
            <option>رويدر</option>
            <option>زيارت علي</option>
            <option>سردشت ـ بشاگرد</option>
            <option>سندرك</option>
            <option>سيريك</option>
            <option>فارغان</option>
            <option>فين</option>
            <option>قشم</option>
            <option>كنگ</option>
            <option>كيش</option>
            <option>ميناب</option>
            </React.Fragment>);
            }else if(ustan=='چهارمحال و بختیاری'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>اردل</option>
            <option>آلوني</option>
            <option>باباحيدر</option>
            <option>بروجن</option>
            <option>بلداجي</option>
            <option>بن</option>
            <option>جونقان</option>
            <option>چالشتر</option>
            <option>چلگرد ـ كوهرنگ</option>
            <option>دزك</option>
            <option>دستنائ</option>
            <option>دشتك</option>
            <option>سامان</option>
            <option>سودجان</option>
            <option>سورشجان</option>
            <option>شلمزار ـ كيار</option>
            <option>شهركرد</option>
            <option>فارسان</option>
            <option>فرادنبه</option>
            <option>فرخ شهر</option>
            <option>كیان</option>
            <option>گندمان</option>
            <option>گهرو</option>
            <option>لردگان</option>
            <option>مال خليفه</option>
            <option>ناغان</option>
            <option>هاروني</option>
            <option>هفشجان</option>
            <option>وردنجان</option>
            </React.Fragment>);
            }else if(ustan=='یزد'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>ابركوه</option>
            <option>احمدآباد</option>
            <option>اردكان</option>
            <option>بافق</option>
            <option>بفروئيه</option>
            <option>بهاباد</option>
            <option>تفت</option>
            <option>حميديا</option>
            <option>زارچ</option>
            <option>شاهديه</option>
            <option>صدوق</option>
            <option>طبس</option>
            <option>عشق آباد</option>
            <option>فراغه</option>
            <option>مروست</option>
            <option>مهريز</option>
            <option>ميبد</option>
            <option>نير</option>
            <option>هرات ـ خاتم</option>
            <option>يزد</option>
            </React.Fragment>);
            }else if(ustan=='سیستان و بلوچستان'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>اسپكه</option>
            <option>ايرانشهر</option>
            <option>بزمان</option>
            <option>بمپور</option>
            <option>بنت</option>
            <option>بنجار</option>
            <option>پسكو</option>
            <option>تيموراباد</option>
            <option>جالق</option>
            <option>چابهار</option>
            <option>خاش</option>
            <option>دوست محمد ـ هيرمند</option>
            <option>راسك</option>
            <option>زابل</option>
            <option>زابلي</option>
            <option>زاهدان</option>
            <option>زهك</option>
            <option>ساربوك</option>
            <option>سراوان</option>
            <option>سرباز</option>
            <option>سنگان</option>
            <option>سوران ـ سيب سوران</option>
            <option>سيركان</option>
            <option>فنوج</option>
            <option>قصرقند</option>
            <option>كنارك</option>
            <option>كيتج</option>
            <option>گلمورتي ـ دلگان</option>
            <option>گوهركوه</option>
            <option>محمدآباد</option>
            <option>ميرجاوه</option>
            <option>نصرت آباد</option>
            <option>نگور</option>
            <option>نيك شهر</option>
            <option>هيدوچ</option>
            </React.Fragment>);
            }else if(ustan=='ایلام'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>اركواز</option>
            <option>ارمو</option>
            <option>ايلام</option>
            <option>ايوان</option>
            <option>آبدانان</option>
            <option>آسمان آباد</option>
            <option>بدره</option>
            <option>توحيد</option>
            <option>چشمه شيرين</option>
            <option>چوار</option>
            <option>دره شهر</option>
            <option>دهلران</option>
            <option>سرابله ـ شيروان و چرداول</option>
            <option>شباب</option>
            <option>شهرك اسلاميه</option>
            <option>لومار</option>
            <option>مهران</option>
            <option>موسيان</option>
            <option>ميمه</option>
            </React.Fragment>);
            }else if(ustan=='کهگلویه و بویراحمد'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>باشت</option>
            <option>پاتاوه</option>
            <option>چرام</option>
            <option>دهدشت ـ كهگيلويه</option>
            <option>دوگنبدان ـ گچساران</option>
            <option>ديشموك</option>
            <option>سپيدار</option>
            <option>سوق</option>
            <option>سي سخت ـ دنا</option>
            <option>قلعه رئيسي</option>
            <option>لنده</option>
            <option>ليكك</option>
            <option>مادوان</option>
            <option>ياسوج ـ 7591</option>
            </React.Fragment>);
            }else if(ustan=='خراسان شمالی'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>اسفراين</option>
            <option>ايور</option>
            <option>آشخانه ـ مانه و سلمقان</option>
            <option>بجنورد</option>
            <option>جاجرم</option>
            <option>درق</option>
            <option>راز</option>
            <option>شوقان</option>
            <option>شيروان</option>
            <option>فاروج</option>
            <option>گرمه</option>
            </React.Fragment>);
            }else if(ustan=='خراسان جنوبی'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>ارسك</option>
            <option>اسديه ـ درميان</option>
            <option>آرين شهر</option>
            <option>آيسك</option>
            <option>بشرويه</option>
            <option>بیرجند</option>
            <option>حاجي آباد</option>
            <option>خضري دشت بياض</option>
            <option>خوسف</option>
            <option>زهان</option>
            <option>سر بیشه</option>
            <option>سرايان</option>
            <option>سه قلعه</option>
            <option>فردوس</option>
            <option>قائن ـ قائنات</option>
            <option>گزيک</option>
            <option>مود</option>
            <option>نهبندان</option>
            <option>نیمبلوك</option>
            </React.Fragment>);
            }else if(ustan=='البرز'){
            return(<React.Fragment>
            <option value="">شهر</option>
            <option>اشتهارد</option>
            <option>آسارا</option>
            <option>چهارباغ</option>
            <option>سيف آباد</option>
            <option>شهر جديد هشتگرد</option>
            <option>طالقان</option>
            <option>كرج</option>
            <option>كمال شهر</option>
            <option>كوهسار ـ چندار</option>
            <option>گرمدره</option>
            <option>ماهدشت</option>
            <option>محمدشهر</option>
            <option>مشکين دشت</option>
            <option>نظرآباد</option>
            <option>هشتگرد ـ ساوجبلاغ</option>
            </React.Fragment>);
            }
        }
    }
}


export class CartSuccess extends Component {
  constructor(props){
    super(props);
    this.state={sql:[],returntext:'...',loading:true}
  }
  componentDidMount(){
    $('header,nav').addClass('minimize');
    this.getCart();
  }
  getCart(){
    const iprops=translate[this.props.locale]
    if(this.props.id){
    let updateData={id:this.props.id}
    postData('getcart',updateData).then((result)=>{
      this.setState({sql:result.cart});
      if(result.cart==null){this.props.redirect('/404');}else if(result.cart.payin){this.setState({loading:false,returntext:iprops.cartSuccess.description+'.'});}
    });
    }
  }
  componentWillUnmount(){
    $('header,nav').removeClass('minimize');
  }
  orderdetailer(id){
    $('.orderlistcarts-'+id).toggleClass('active');
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
  toEnglishDigits(str){if(this.props.locale!='fa' && this.props.locale!='ar'){return str}var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];return str.replace(/[0-9]/g, function (w) {return id[+w];});}
  numberWithCommas(x){if(!x){x='0';}return this.toEnglishDigits(x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));}
  render(){
  const iprops=translate[this.props.locale]
  let self=this;
  let order;
  let orderdetail;
  if(this.state.sql){
  let key='000';
  let valuestate=(<b style={{color:'red'}}>{iprops.dashboard.faild}</b>);
  if(this.state.sql.status==1){valuestate=(<b style={{color:'green'}}>{iprops.dashboard.successful}</b>);}
  if(this.state.sql.payin=='home'){valuestate=(<b>{iprops.dashboard.payathome}</b>);}
  if(self.state.sql.products){
  orderdetail=Object.values(JSON.parse(self.state.sql.products)).map(function(valueZ,keyZ){
  if(valueZ!=null){
  return(<React.Fragment>
  <div className="orderlistcart" key={`orderlistcart-${keyZ}`}>
      <div className="orderlistcartcol"><span>{iprops.dashboard.product}</span><span>{valueZ.title}</span></div>
      <div className="orderlistcartcol"><span>{iprops.dashboard.count}</span><span>{valueZ.count}</span></div>
      <div className="orderlistcartcol"><span>{iprops.dashboard.amount}</span><span>{self.mulababy(valueZ.amount)}</span></div>
  </div>
  </React.Fragment>);
  }
  });
  }
  order=(<React.Fragment>
    <div className={`orderlistitem${self.state.loading ? ' orderlistitem-loading' : ''}`} key={`order-${key}`}>
    <div className="orderlistitemcol"><span>{iprops.dashboard.referralcode}</span><span>{this.state.sql.orderid}</span></div>                    
    <div className="orderlistitemcol"><span>{iprops.dashboard.orderdate}</span><span>{moment(this.state.sql.created_at).format('jYYYY/jM/jD')}</span></div>                                     
    <div className="orderlistitemcol"><span>{iprops.dashboard.finalamount}</span><span>{self.mulababy(self.state.sql.amount)}</span></div>     
    <div className="orderlistitemcol"><span>{iprops.dashboard.grievance.status}</span><span>{valuestate}</span></div>                  
    <div className="orderlistitemcol"><a href={`/factor/${this.state.sql.orderid}`} rel="noreferrer" target="_blank">{iprops.dashboard.downloadinvoice}</a></div>
    <div className="orderlistitemcol"><a onClick={()=>self.orderdetailer(key)} data-products={this.state.sql.products}>{iprops.dashboard.orderdetails}</a></div>                    
    </div>
    <div className={`orderlistcarts orderlistcarts-${key}`}>{orderdetail}</div>
  </React.Fragment>);
  }
  return (
    <React.Fragment>
    <div className="container-cafca">
    <div className="titlebar">{iprops.cartSuccess.title}</div>
    <div style={{textAlign:'center'}}>
    {this.state.returntext}<br/><br/>
    {order}
    <Link href="/dashboard/orders"><a className="btn" style={{marginTop:0+'px',display:'inline-block'}}>{iprops.dashboard.myorders}</a></Link>
    </div>
    </div>
    </React.Fragment>
  );
  }
}
export class CartFaild extends Component {
  constructor(props){
    super(props);
  }
  render(){
  const iprops=translate[this.props.locale]
  return (
    <React.Fragment>
    <div className="container-cafca">
    <div className="titlebar">{iprops.cartFaild.title}</div>
    <div style={{textAlign:'center'}}>
    {iprops.cartFaild.description}.<br/>
    {this.props.id && 
    <div>{iprops.dashboard.referralcode}: {this.props.id}<br/></div>}
    <Link href="/"><a className="btn" style={{marginTop:15+'px',display:'inline-block'}}>{iprops.home}</a></Link>
    </div>
    </div>
    </React.Fragment>
  );
  }
}