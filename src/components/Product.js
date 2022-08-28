import React, { Component } from 'react';
import { withRouter } from 'next/router'
import Link from 'next/link';
import $ from 'jquery';
import axios from 'axios';
import Cookies from 'universal-cookie';
import * as moment from 'jalali-moment';
import {postData} from '../lib/postData';
import Login from './Login';
// import Lastvisits from './LastVisits';
// import RelatedProducts from './RelatedProducts';
import ProductGrabber from './ProductGrabber';
import translate from '@/config/translate';
// import Image from 'next/image';
import {
    Magnifier,
    GlassMagnifier,
    SideBySideMagnifier,
    PictureInPictureMagnifier,
    MOUSE_ACTIVATION,
    TOUCH_ACTIVATION
  } from "react-image-magnifiers";
const nl2br = require('react-nl2br');
import Dictionary from './Dictionary';

// const valuevalue = React.useContext(MasterContext);

export default withRouter(class ProductBache extends Component {
    constructor(props){
        super(props);
        this.state={
         epoch:false,sql:[],related:[],lastvisits:[],tags:[],count:0,firstload:false,customize:false,customizeLogin:false,customizecolor:'',color:'default',isLogined:false,isSubscribe:false,showComments:false,notifStatus:'inventory',redirect:false,comments:[],productDesigner:'',productId:'',productColor:'',price:'',img:'',size:'',imgkey:0,title:'محصول',sizedetail:[],userData:false,NoticeMeInventory:false,showNotif:false,userName:'کاربر مهمان',completeyourstyle:false,url:'',urlbug:false,userPhone:''
        }
        this.addToFavorite = this.addToFavorite.bind(this);
        this.NotifCloser = this.NotifCloser.bind(this);
        this.goBack = this.goBack.bind(this);
        this.ipcolor = this.ipcolor.bind(this);
        this.galleryUpdate = this.galleryUpdate.bind(this);
        this.showComments = this.showComments.bind(this);
        this.hideComments = this.hideComments.bind(this);
        this.sendComment = this.sendComment.bind(this);
        this.Subscribe = this.Subscribe.bind(this);
        this.NoticeMeInventory = this.NoticeMeInventory.bind(this);
        this.NoticeMeCoupon = this.NoticeMeCoupon.bind(this);
        this.addToCartBtnUpdate = this.addToCartBtnUpdate.bind(this);
        this.checkLogin=this.checkLogin.bind(this);
        this.customsewbtn=this.customsewbtn.bind(this);
        this.closecustomize=this.closecustomize.bind(this);
        this.customizecolorselector=this.customizecolorselector.bind(this);
        this.checkcustomize=this.checkcustomize.bind(this);
        this.updateProduct=this.updateProduct.bind(this);
        this.productscleaner=this.productscleaner.bind(this);
        this.lister=this.lister.bind(this);
    }
    componentDidMount(){
        // $('body').addClass('nosearch');
        // let m=moment('2/22/2020','Y-m-d');
        // let todayJalali = moment().locale('fa').format('YYYY/M/D');
        // console.log('>'+todayJalali);
        this.updateProduct();
    }
    updateProduct(){
        let userId='null';
        let userphone='null';
        $('body').addClass('loading');
        if(localStorage.getItem('userData')){
            let userData=localStorage.getItem('userData');
            this.setState({'isLogined':true});
            this.setState({'userData':userData});
            this.setState({'userName':JSON.parse(userData).fullname});
            this.setState({'userPhone':JSON.parse(userData).userphone});
            userId=JSON.parse(userData).id;
            userphone=JSON.parse(userData).userphone;
        }
        $('header,nav').addClass('minimize');
        const {productid,title} = this.props.router.query;
        let self=this,color='default';
        // let encodeUrl=(str)=>{if(!str){return str}return str.replace(/ /g,'-')}
        let encodeUrl=(str)=>{return str.replace(/ /g,'-')}
        if(window.location.hash){color=window.location.hash.substring(1);}
        const response=this.props.sql
        let dataurl=response.url;
        if(!dataurl){dataurl=response.title;}
        dataurl=encodeUrl(dataurl);
        if(dataurl!=title){self.setState({urlbug:true});}
        this.setState({sql:response,title:response.title,url:dataurl,img:response.img,comments:response.comments,productDesigner:response.designerId});
        this.setState({productId:productid,productColor:color,firstload:true},()=>{
            self.addToCartBtnUpdate();
        });
        // console.log(response.colors);
        Object.values(response.colors).map(function(valueX,keyX){
            if(keyX==0 || valueX.url==color){
                if(valueX.url==color || color=='default'){
                    let colornum=0;
                    let currentsize=JSON.parse(valueX.sizes);
                    // console.log(currentsize);
                    currentsize.forEach(function(entry){
                        if(colornum==0 && entry.count!=0){
                            self.setState({'size':entry.size,'count':entry.count,'sizedetail':entry,'price':valueX.price,'color':color});
                            colornum++;
                        }
                    });
                }
            }
        });
        let completeyourstyle=false;
        let completeyourstyleIds=[];
        const productuniq=productid+'#'+color;
        if(this.props.productset){
            Object.values(this.props.productset).map(function(setrow){
                let setrowArr=setrow.products.split(',');
                if(setrowArr.includes(productuniq)){
                    completeyourstyle=true;
                    setrowArr.map(function(setrowArrItem){
                        if(setrowArrItem!=productuniq && !completeyourstyleIds.includes(setrowArrItem)){
                            const setrowArrItemId=setrowArrItem.split('#')[0];            
                            completeyourstyleIds.push(setrowArrItemId);
                        }
                    });
                }
            });
        }
        if(this.state.epoch!=productid){
            postData('productepoch/'+productid,{set:completeyourstyleIds,color:color,locale:this.props.locale,userphone:userphone,userid:userId},true).then(response=>{
                if(response.status=='200'){
                    if(response.is_favorite){
                        $('.tsFave').addClass('added');
                    }
                    completeyourstyle=this.productscleaner(response.set)
                    this.setState({completeyourstyle,lastvisits:this.productscleaner(response.lastvi),tags:response.tags,related:this.productscleaner(response.related)})
                }
            });
            this.setState({epoch:productid})
        }
        $('body').removeClass('loading');
    }
    componentDidUpdate(prevProps,prevState,snapshot){
        let self=this,color='default';
        const {productid} = this.props.router.query;
        if(window.location.hash){color=window.location.hash.substring(1);}
        if(this.state.firstload && this.state.sql && this.state.sql.colors && color!=this.state.color){
            if(productid!=prevProps.sql.id){
                self.updateProduct();
            }
            Object.values(this.state.sql.colors).map(function(valueX,keyX){
                if(keyX==0 || valueX.url==color){
                    if(valueX.url==color || color=='default'){
                        let colornum=0;
                        let currentsize=JSON.parse(valueX.sizes);
                        // console.log(currentsize);
                        currentsize.forEach(function(entry){
                            if(colornum==0 && entry.count!=0){
                                self.setState({'size':entry.size,'count':entry.count,'sizedetail':entry,'price':valueX.price,'color':color});
                                colornum++;
                            }
                        });
                        if(colornum==0){
                            self.setState({'count':0,'color':color});
                        }
                        // console.log('>>'+colornum);
                    }
                }
            });
        }
    }
    productscleaner(e,color=false){
        let self=this;
        let products=[];
        let uniqKEY=0;
        Object.values(e).map(function(valP,keyP){
          valP.colors.forEach(function(item,index){
              if(color && color!=item.url){}{
              products[uniqKEY]=[];
              products[uniqKEY].brand=valP.brand;
              let itemImg=item.img.split(',');
              if(item.thumbnail==''){products[uniqKEY].img=itemImg[0];}else{products[uniqKEY].img=item.thumbnail;}
              products[uniqKEY].title=valP.title;
              products[uniqKEY].colortitle=item.title;
              products[uniqKEY].colorurl=item.url;
              products[uniqKEY].url=valP.url;
              products[uniqKEY].id=valP.id;
              products[uniqKEY].cat=valP.cat;
              products[uniqKEY].sales=item.sales;
              products[uniqKEY].pid=valP.id;
              products[uniqKEY].designer=valP.designer;
              products[uniqKEY].price=item.price;
              products[uniqKEY].sex=valP.sex;
              products[uniqKEY].catparent=valP.catparent;
              products[uniqKEY].views=item.views;
              products[uniqKEY].key=valP.id+'-'+item.id;
              let productcount=0;
              if(self.isJSON(item.sizes)){
                  JSON.parse(item.sizes).map(function(itemsizes){
                      productcount+=parseInt(itemsizes['count']);
                  });
              }
              products[uniqKEY].count=productcount;
              uniqKEY++;
            }
          });
        });
        return products
    }
    isJSON(str) {
        try {
            return (JSON.parse(str) && !!str);
        } catch (e) {
            return false;
        }
    }
    // componentDidUpdate(prevProps,prevState,snapshot){
    //     self.setState({urlbug:false});
    // }
    UNSAFE_componentWillUnmount(){
        $('body').removeClass('nosearch');
        $('header,nav').removeClass('minimize');
        $('.navCat a').removeClass('superactive');
    }
    // onScroll(){
    //     const scrollPos = $(document).scrollTop();
    //     const winWeed=$(window).width();
    //     if (winWeed >= 1000) {
    //         $('.galleryimg img:nth-child(1)').css({'margin-top':(scrollPos/3)+'px'});
    //         $('.galleryimg img:nth-child(2)').css({'margin-top':(scrollPos/5)+'px'});
    //     }
    // }
    goBack(e=false,b=true){
        if(e){
            const self=this;
            let before=window.location.href;
            window.history.back()
            // this.props.history.goBack();
            setTimeout(function(){
            let after=window.location.href;
            if(before==after){self.goBack(e,false)}    
            },100);
            let btn=$(e.currentTarget);
            btn.addClass('clicked');
            setTimeout(function(){btn.removeClass('clicked');},400);
        }else{
        this.props.history.goBack();
        }
    }
    addToCartBtnUpdate(){
        const self=this;
        const cookies = new Cookies();
        let btn=$('.addToCart');
        let btnproductid=btn.data('id');
        let btnproductcolor=btn.data('color');
        let btnproductsize=$('.ipiBoxSizes .ipsize.active').html();
        let products=cookies.get('products');
        // console.log(products);
        // console.log(btnproductid+'>>>>'+btnproductcolor+'>>'+btnproductsize);
        btn.removeClass('added');
        if(products){
            console.log(btn,'khalie?')
        Object.values(products.products).map(function(item,i){
            if(item && item.id==btnproductid && item.color==btnproductcolor && item.size==btnproductsize){
               btn.addClass('added');
               $('.icon-cart').addClass('animated shake added');
            }
        });
        }    
    }
    addToFavorite(){
        let self=this;
        let btn=$('.tsFave');
        if(btn.hasClass('added')){
            btn.removeClass('added');
            $('.icon-favorite').removeClass('animated shake');
            let updateData={productid:this.state.productId,productcolor:this.state.productColor,userphone:self.state.userPhone}
            postData('removefavorite',updateData).then((result)=>{});
        }else{
            btn.addClass('added');
            $('.icon-favorite').addClass('animated shake');
            let updateData={productid:this.state.productId,productcolor:this.state.productColor,userphone:self.state.userPhone}
            postData('newfavorite',updateData).then((result)=>{});
        }
    }
    NotifCloser(){
        let showNotif=!this.state.showNotif;
        this.setState({showNotif:showNotif});
    }
    addToCart(){
        const cookies = new Cookies();
        let btn=$('.addToCart');
        let products=cookies.get('products');
        let productid=btn.data('id');
        let producttitle=btn.data('title');
        let productprice=btn.data('price');
        let coupon=btn.data('coupon');
        let offerprice=btn.data('offerprice');
        let productsize=$('.ipiBoxSizes .ipsize.active').html();
        let productcolor=btn.data('color');
        let productcolortitle=btn.data('colortitle');
        let countlimit=btn.data('countlimit');
        let productimg=btn.data('img');
        let iconcartb=parseInt($('.icon-cart b').html());
        if(btn.hasClass('added')){
            btn.removeClass('added');
            $('.icon-cart').removeClass('animated shake added');
            $('.icon-cart b').html(iconcartb-1);
            Object.values(products.products).map(function(item,i){
                if(item && item.id==productid && item.color==productcolor && item.size==productsize){
                    delete products.products[i];
                }
            });
            cookies.set('products',products,{path:'/'});
        }else{
            let dAta={"id":productid,"title":producttitle,"img":productimg,"amount":productprice,"offerid":coupon,"offerprice":offerprice,"count":1,"countlimit":countlimit,"size":productsize,"color":productcolor,"colortitle":productcolortitle,"customsew":false};
            if(products==null){
                cookies.set('products',JSON.stringify({'products':[dAta]}),{path:'/'});
            }else{
                let ifaxisted=false;
                Object.values(products.products).map(function(item,i){
                    if(item && item.id==productid && item.color==productcolor && item.size==productsize){
                        ifaxisted=true;
                    }
                });
                if(!ifaxisted){
                    products.products.push(dAta);
                    cookies.set('products',products,{path:'/'});
                }
            }
            btn.addClass('added');
            $('.icon-cart').addClass('animated shake added');
            $('.icon-cart b').html(iconcartb+1);
            $('html,body').animate({scrollTop:0},300);
            $('nav').addClass('colorloser');
            setTimeout(function(){$('nav').removeClass('colorloser');},800);
        }
        
    }
    substrBytes(str, start, length){
        let buf=str;
        return buf.slice(start, start+length).toString();
    }
    toFarsiNumber(n) {const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];return n.toString().split('').map(x => farsiDigits[x]).join('');}
    toEnglishDigits(str){if(this.props.locale!='fa' && this.props.locale!='ar'){return str}var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];return str.replace(/[0-9]/g, function (w) {return id[+w];});}
    numberWithCommas(x){return this.toEnglishDigits(x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));}
    showComments(){
        this.setState({showComments:true});
    }
    hideComments(){
        this.setState({showComments:false});
    }
    sendComment(){
        let self=this;
        let scTitle=$('.scTitle').val();
        if(scTitle==''){scTitle='بدون عنوان';}
        let scContent=$('.scContent').val();
        if(scContent==''){$('.scContent').addClass('error');setTimeout(function(){$('.error').removeClass('error');},1000);}else{
            self.disabled=true;
            let updateData={title:scTitle,content:scContent,productid:this.state.productId,productcolor:this.state.productColor,userphone:self.state.userPhone,username:self.state.userName}
            $('.iproductcomment:nth-last-child(1) input,.iproductcomment:nth-last-child(1) textarea').attr('disabled',true);
            $('.iproductcomment:nth-last-child(1) input,.iproductcomment:nth-last-child(1) a').addClass('pending');
            postData('newcomment',updateData).then((result)=>{
                $('.iproductcomment:nth-last-child(1)').before('<div class="iproductcomment animated slideInUp"><div class="iproductcommenthead"><h5>'+self.state.userName+'</h5><div class="ipchtime">'+moment().locale('fa').format('HH:mm YYYY/M/D')+'</div></div><p>'+scContent+'</p><p style="opacity:.6;">نظر شما پس از تایید مدیریت نمایش داده میشود.</p></div>');
                $('.iproductcomment:nth-last-child(1)').remove();
            });
        }
    }
    ipcolor(key){
        let currIMGSOURCE=this.state.sql.colors[key].img;
        let currPRICE=this.state.sql.colors[key].price;
        let currUrl=this.state.sql.colors[key].url;
        currIMGSOURCE=currIMGSOURCE.split(',');
        currIMGSOURCE=currIMGSOURCE[0];
        this.setState({img:currIMGSOURCE,imgkey:0,price:currPRICE,productColor:currUrl});
    }
    sizeUpdate(size,count,key,detail){
        if(count!=0){
        $('.ipsize').removeClass('active');
        $('.ipsize:nth-child('+(key+1)+')').addClass('active');
        this.setState({size:size,count:count,sizedetail:detail});
        this.addToCartBtnUpdate();
        } 
    }
    galleryUpdate(source,key){
        this.setState({img:source,imgkey:key});
    }
    lister(x){
        const self=this;
        let xx=x.toString().split(/\r?\n/);
        let li=[];
        xx.forEach(function(item,i){
            li.push(<li key={`li-${i}`}>{Dictionary(item,self.props.senser)}</li>);
        });
        return <ul>{li}</ul>;
        const test='<a>btR</a>';
    }
    Subscribe(e){
    let whatofnotif=$('input[name=whatofnotif]:checked').val();
    let productId=this.state.productId;
    let productColor=this.state.productColor;
    let self=this;
    if(this.state.userData){
        let updateData={id:productId,color:productColor,notif:whatofnotif,userData:this.state.userData}
        // console.log(updateData);
        self.setState({isSubscribe:true});
        postData('newnotice',updateData);
    }
    }
    checkLogin(){
        if(localStorage.getItem('userData')){
            this.setState({'isLogined':true},()=>{
                if(this.state.showNotif){
                    this.setState({'isLogined':true});
                    if(this.state.customizeLogin){
                        this.setState({showNotif:false,customizeLogin:false,customize:true});
                    }else{
                    this.setState({showNotif:!this.state.showNotif},()=>this.NoticeMeInventory());
                    }
                }
                $('.navProf').attr('data-tip','حساب کاربری');
                $('.navProf,.navProfMobile').attr('href','/dashboard/profile');
            });
        }else{
            this.setState({'isLogined':false},()=>{
                $('.navProf span,.navProfMobile span').html('ورود / ثبت نام');
                $('.navProf,.navProfMobile').attr('href','/dashboard/login');
            });
        }
    }
    NoticeMeInventory(){
        this.setState({notifStatus:'inventory',showNotif:!this.state.showNotif});
        if(this.state.isLogined){
        let updateData={notice:'inventory',userData:localStorage['userData'],userphone:this.state.userPhone,productId:this.state.productId,productColor:this.state.productColor}
        postData('noticeme',updateData);
        }else{
            this.setState({customizeLogin:false});
        }
    }
    NoticeMeCoupon(){
        this.setState({notifStatus:'coupon',showNotif:!this.state.showNotif});
        if(this.state.isLogined){
        let updateData={notice:'coupon',userData:localStorage['userData'],userphone:this.state.userPhone,productId:this.state.productId,productColor:this.state.productColor}
        postData('noticeme',updateData);
        }else{
            this.setState({customizeLogin:false});
        }
    }
    checkcustomize(){
        const self=this;
        let somayenaro=false;
        let detail=[];
        let color=$('.iproductCustomizeFormInputContentOption.active').html();
        if(typeof color==='undefined'){
            somayenaro=true;
            const colorElm=$('.iproductCustomizeFormInput-color');
            colorElm.addClass('error');
            if(!colorElm.hasClass('active')){colorElm.addClass('active');}else{
            colorElm.removeClass('active');
            setTimeout(function(){colorElm.addClass('active');},500);
            }
        }else{
            detail.push(['رنگ',color]);
        }
        let sizeprob=false;
        $('.iproductCustomizeFormInputPut').each(function(){
            let name=$(this).find('label').html();
            let val=$(this).find('input').val();
            detail.push([name,val]);
            if(val=='' || $(this).hasClass('error-min') || $(this).hasClass('error-max')){sizeprob=true;}
        });
        if(sizeprob){
            somayenaro=true;
            const sizesElm=$('.iproductCustomizeFormInput-sizes');
            sizesElm.addClass('error');
            if(!sizesElm.hasClass('active')){sizesElm.addClass('active');}else{
            sizesElm.removeClass('active');
            setTimeout(function(){sizesElm.addClass('active');},500);
            }
        }
        if(!somayenaro){
            let colorprice=0;
            let productimg=self.state.sql.img;
            Object.values(self.state.sql.colors).map(function(valueX,keyX){
                if(self.state.productColor==valueX.url){
                    colorprice=valueX.price;
                    productimg=valueX.thumbnail;
                }
            });
            let productprice=colorprice;
            let coupon=false;
            let couponpercent=0;
            let couponid=false;
            {self.props.coupons && Object.values(self.props.coupons).map(function(couponvalue,couponkey){
                if(!coupon && couponvalue.type=='product' && (couponvalue.target=='all' || couponvalue.target==self.state.productId)){
                    if(couponvalue.numtype=='percent'){
                        productprice=productprice-((couponvalue.num/100)*productprice);
                        couponpercent=couponvalue.num;
                    }else{
                        productprice=productprice-couponvalue.num;
                        couponpercent=Math.floor(((colorprice-productprice)/colorprice)*100);
                    }
                    if(productprice<0){productprice=0;}
                    coupon=true;
                    couponid=couponvalue.id;
                }
            })}
            const cookies = new Cookies();
            let btn=$('.addToCart');
            let products=cookies.get('products');
            let productid=self.state.sql.id;
            let producttitle=self.state.sql.title;
            let productcolor=self.state.productColor;
            let productcolortitle=self.state.customizecolor;
            let iconcartb=parseInt($('.icon-cart b').html());
            let dAta={"id":productid,"title":producttitle,"img":productimg,"amount":colorprice,"offerid":couponid,"offerprice":productprice,"count":1,"size":"","color":productcolor,"colortitle":productcolortitle,"customsew":detail};
            if(products==null){
                cookies.set('products',JSON.stringify({'products':[dAta]}),{path:'/'});
            }else{
                let ifaxisted=false;
                let ifaxistedid=0;
                Object.values(products.products).map(function(item,i){
                    if(item && item.id==productid && item.color==productcolor && item.size==""){
                        ifaxisted=true;
                        ifaxistedid=i;
                    }
                });
                if(!ifaxisted){
                    products.products.push(dAta);
                    cookies.set('products',products,{path:'/'});
                }else{
                    products.products[ifaxistedid]=dAta;
                    cookies.set('products',products,{path:'/'});
                }
            }
            // btn.addClass('added');
            $('.icon-cart').addClass('animated shake added');
            $('.icon-cart b').html(iconcartb+1);
            $('html,body').animate({scrollTop:0},300);
            $('nav').addClass('colorloser');
            setTimeout(function(){$('nav').removeClass('colorloser');},800);
            self.props.history.push('/cart');
        }else{
            setTimeout(function(){$('.error').removeClass('error');},1000);
        }
    }
    closecustomize(){
        this.setState({customize:false});
    }
    customsewbtn(){
        if(this.state.isLogined){
            this.setState({customize:!this.state.customize});
        }else{
            this.setState({showNotif:true,customizeLogin:true});
        }
    }
    customizeforminputtoggle(e){
        $(e.currentTarget).parent().toggleClass('active');
    }
    customizecolorselector(e){
        let color=$(e.currentTarget).html();
        this.setState({customizecolor:color});
    }
    inputLabeler(e){
        let base=$(e.currentTarget);
        let val=base.val();
        let len=val.length;
        let elm=base.parent();
        let min=base.data('min');
        let max=base.data('max');
        let errorarea=$('.iproductCustomizeFormInputPutError-'+base.data('key'));
        if(len==0){elm.removeClass('active');}else{elm.addClass('active');}
        if(isNaN(val)){base.val('');elm.removeClass('active');}
        if(val<min && val!='' && min!=0 && max!=0){errorarea.addClass('error-min');elm.addClass('error-min');}else{errorarea.removeClass('error-min');elm.removeClass('error-min');}
        if(val>max && val!='' && min!=0 && max!=0){errorarea.addClass('error-max');elm.addClass('error-max');}else{errorarea.removeClass('error-max');elm.removeClass('error-max');}
    }
    ipropsraw(string){
        string=string.trim()
        if(this.props.locale=='en'){
            switch(string){
                case 'اندازه کف کفش':return 'shoe sole size';
                case 'ابعاد':return 'dimensions';
                case 'عرض':return 'weight';
                case 'قد':return 'height';
                case 'دور کمر':return 'waist';
                case 'اندازه پاشنه':return 'heel size';
                default:return string;
            }
        }
        if(this.props.locale=='ar'){
            switch(string){
                case 'اندازه کف کفش':return 'أبعاد نعل الحذاء';
                case 'قد':return 'ارتفاع';
                case 'دور کمر':return 'وَسَط';
                case 'اندازه پاشنه':return 'حجم الكعب';
                default:return string;
            }
        }
        return string
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
        // console.log('>>>',valuevalue);
        // console.log(this.props);
        // return false;

        // let todayJalali = moment().locale('fa').format('YYYY/M/D');
        // console.log('>'+todayJalali);
        const iprops=translate[this.props.locale]
        let encodeUrl=(str)=>{if(!str){return '-';}return str.replace(/ /g,'-')}
        let sizedetail=[];
        if(this.state.sizedetail){sizedetail=this.state.sizedetail;}
        let title=this.state.title;
        let iproductcolors,iproductsizes,iproductimagesEven,iproductimagesOdd,iproductimagesWitch=false,ipsizeStyle,iproductimagescount=0;
        let self=this,iproductDesigner,iproductBrand;
        let color='default';
        let colortitle='تک رنگ';
        let colorurl='';
        let previewimg,colorprice=0;
        if(typeof window !== 'undefined' && window.location.hash){color=window.location.hash.substring(1);}
        let currIMGSource = this.state.img;
        let defaultColor='default';
        let colorscount=0;
        if(self.props.designers){
            self.props.designers.forEach(function(item,i){
                if(self.state.productDesigner==item.id){
                    iproductDesigner=<Link href={`/@${item.url}`}><a className="ipiBoxCol ipiBoxBack"><i>{iprops.designer} :</i> <span>{item.name}</span></a></Link>
                    iproductBrand=<Link href={`/@${item.url}`}><a className="ipiBoxCol ipiBoxBack"><i>{iprops.brand} :</i> {item.logo ? (<img src={item.logo} draggable="false" title={item.brand} className="thisbrand" alt={item.brand} />) : ('')}{item.brand ? (<b style={{marginRight:0}} className="thisbrand">{item.brand}</b>) : ('')}</a></Link>;
                }
            });
        }
        let completeyourstyle=false;
        let completeyourstyleArr=[];
        let productuniq=this.state.productId+'#'+this.state.productColor;
        if(this.props.productset){
            Object.values(this.props.productset).map(function(setrow){
                let setrowArr=setrow.products.split(',');
                if(setrowArr.includes(productuniq)){
                    if(self.state.completeyourstyle){completeyourstyle=true;}
                    setrowArr.map(function(setrowArrItem){
                        if(setrowArrItem!=productuniq && !completeyourstyleArr.includes(setrowArrItem)){
                        completeyourstyleArr.push(setrowArrItem);
                        }
                    });
                }
            });
        }
        let imgs=[];
        if(this.state.sql.colors){
        iproductcolors=Object.values(this.state.sql.colors).map(function(valueX,keyX){
            colorscount++;
            if(keyX==0){defaultColor=valueX.url;}
            let imgsAlt=title+' رنگ '+valueX.title;
            if(imgs.length==0){imgs=valueX.img.split(',');}
            if(color==valueX.url){
                imgs=valueX.img.split(',');
                colortitle=valueX.title;
                previewimg=valueX.thumbnail;
                colorprice=valueX.price;
                let currIMG=self.state.imgkey;
                let ii=0;
                iproductsizes=JSON.parse(valueX.sizes).map(function(item,i){
                if(item.count==0){ipsizeStyle=' disabled';}else{ii+=1;ipsizeStyle='';if(ii==1){ipsizeStyle+=' active';}}
                return(<div className={`ipsize${ipsizeStyle}`} key={i} onClick={()=>self.sizeUpdate(item.size,item.count,i,item)}>{item.size=='FREE' ? ('فری سایز') : (item.size)}</div>);
                });
                iproductimagesOdd=imgs.map(function(valueZ,keyZ){
                iproductimagescount++;
                if(iproductimagescount % 2 == 0) {return false}
                iproductimagesWitch=!iproductimagesWitch;
                let currSTYLE;
                if(keyZ==currIMG){currSTYLE=' active';}else{currSTYLE='';}
                return(<div key={`color-${keyZ}`} className={`ipiboximage${currSTYLE}`}><div className="ipiboximageinner"><GlassMagnifier magnifierBorderColor="#a1b7a1" magnifierSize="40%" imageSrc={valueZ} imageAlt={imgsAlt}/></div></div>);
                });
                iproductimagesEven=imgs.map(function(valueZ,keyZ){
                iproductimagescount++;
                if(iproductimagescount % 2 != 0) {return false}
                iproductimagesWitch=!iproductimagesWitch;
                let currSTYLE;
                if(keyZ==currIMG){currSTYLE=' active';}else{currSTYLE='';}
                return(<div key={`color-${keyZ}`} className={`ipiboximage${currSTYLE}`}><div className="ipiboximageinner"><GlassMagnifier magnifierBorderColor="#a1b7a1" magnifierSize="40%" imageSrc={valueZ} imageAlt={imgsAlt}/></div></div>);
                });
            }
            return (<Link href={`/product-${self.state.sql.id}/${encodeURIComponent(encodeUrl(self.state.url))}#${valueX.url}`} key={keyX}><a onClick={()=>self.ipcolor(keyX)} className={`ipcolor${valueX.url==color ? (' active') : ('')}`}>
            <img alt={valueX.title} src={valueX.thumbnail} draggable="false"/>
            <span>{valueX.title}</span>
            </a></Link>);
        });
        
        if(color=='default' && defaultColor!='default' || (color!='default' && self.state.urlbug && self.state.url!='' && self.state.title!=self.state.url)){
            let winref='/'+window.location.href.replace(/^http[s]?:\/\/.+?\//, '');
            const winfollow=`/product-${self.state.sql.id}/${self.state.url}#${defaultColor}`;
            if(winref!=winfollow){
            // self.setState({urlbug:false});
            self.props.redirect(winfollow);
            return false
            }
        }
        }else{iproductcolors='';}
        let comments=Object.values(this.state.comments).map(function(value,key){
        let updated_at=moment(value.created_at,'YYYY-M-D HH:mm').format('HH:mm jYYYY/jM/jD');
        if(value.status==1){
        return(
            <div className="iproductcomment" key={key}>
                <div className="iproductcommenthead"><h5>{value.username}</h5><div className="ipchtime">{updated_at}</div></div>
                <p>{value.content}</p>
                {value.reply ? (<p style={{opacity:'.6'}}>{iprops.comment.dizasanswer}: {value.reply}</p>) : ('')}
            </div>
        );
        }
        });
        // for (const [keyA, valueA] of Object.entries(self.props.navList)) {}
        if(this.state.sql=='404' || this.state.redirect){self.props.redirect(`/404`);}
        let NotifTitle='';
        if(this.state.notifStatus=='inventory'){
            NotifTitle=iprops.notifymewhenavailable;
        }else{
            NotifTitle=iprops.noticeofproductdiscounts;
        }
        if(!this.state.isLogined){
            NotifTitle=iprops.loginsignup;
        }
        let productprice=colorprice;
        let coupon=false;
        let couponpercent=0;
        let couponid=false;
        {self.props.coupons && Object.values(self.props.coupons).map(function(couponvalue,couponkey){
            if(!coupon && couponvalue.type=='product' && (couponvalue.target=='all' || couponvalue.target==self.state.productId)){
                if(couponvalue.numtype=='percent'){
                    productprice=productprice-((couponvalue.num/100)*productprice);
                    couponpercent=couponvalue.num;
                }else{
                    productprice=productprice-couponvalue.num;
                    couponpercent=Math.floor(((colorprice-productprice)/colorprice)*100);
                }
                if(productprice<0){productprice=0;}
                coupon=true;
                couponid=couponvalue.id;
            }
        })}
        const owlProductGallery={
          responsive:{
            500:{items:2},
            0:{items:1}
          },
          items:2,
          autoHeight:true,
          autoHeightClass: 'owl-height',
          margin:15,
          dots:false,
          nav:true,
          rtl:true,
        };
        let customsew=false;
        let customsewcolors=[];
        let customsewsizes=[];
        if(self.state.sql && self.state.sql.customsew!='' && self.state.sql.customsew!=null){
        customsew=true;
        let customsewdata=JSON.parse(self.state.sql.customsew);
        customsewdata.forEach(function(item,i){
            if(i==0){customsewcolors=item;}else{customsewsizes.push(item);}
        });
        if(customsewcolors.length>=1 && customsewdata.length>1){
        // console.log(customsewcolors.length);
        }else{customsew=false;}
        }
        return(<React.Fragment>
        <div className="iproduct">
            {this.state.sql.length!=0 ? (<div className="whereami inmobile">
                <a></a>
                <a></a>
                <Link href="/">{iprops.home}</Link>
                {/* <Link>فارغ از جنسیت</Link> */}
                {this.state.sql.catSex && <Link href={encodeUrl(`/categories/${this.state.sql.catSex}`)}>{this.state.sql.catSex}</Link>}
                {this.state.sql.catNav && <Link href={encodeUrl(`/categories/${this.state.sql.catSex}/${this.state.sql.catNav}`)}>{this.state.sql.catNav}</Link>}
                {/* {this.state.sql.catParent && <Link to={`/categories/${this.state.sql.catNav}/${this.state.sql.catParent}`}>{this.state.sql.catParent}</Link>} */}
                {this.state.sql.catTitle && <Link href={encodeUrl(`/categories/${this.state.sql.catSex}/${this.state.sql.catNav}/${this.state.sql.catTitle}`)}>{this.state.sql.catTitle}</Link>}
                <a className={`${self.state.customize ? '' : 'active'}`} style={{cursor:self.state.customize ? 'pointer': 'default'}} onClick={self.closecustomize}>{this.state.sql.title}</a>
                {self.state.customize ? (<a className="active">{iprops.sewingorder}</a>) : null}
                <a className="catpreviewbarmore" onClick={self.goBack.bind(this)}><span>{iprops.back}</span></a>
            </div>) : ('')}
            {this.state.sql.title && !this.state.customize ? (<div className="iproductArea">
            <div className="iproductside">
            <div className="iproductsideinner">
            {iproductimagescount > 1 &&
            <div className="iproductImages">
                <div className="iproductImagesOdd">
                {iproductimagesEven}
                </div>
                <div className="iproductImagesEven">
                {iproductimagesOdd}              
                </div>
            </div>
            }
            {this.state.title!='محصول' &&
            <div className="iproductcomments animated fadeIn delay-1s">
                {comments}
                <div className="iproductcomment animated slideInUp">
                <div className="ipchuser">
                    {/* {comments.length==0 && <div>اولین نفری باشید که در مورد این محصول نظر میدهد.</div>} */}
                    {iprops.comment.sendtextname1} {this.state.userName} {iprops.comment.sendtextname2}.
                    </div>
                {/* <div className="input"><label>عنوان نظر</label><input type="text" className="scTitle" placeholder="عنوان نظر"/></div> */}
                <div className="input"><textarea className="scContent" placeholder={`${iprops.comment.textarea}...`}></textarea></div>
                <div className="input"><a className="btn" onClick={this.sendComment}>{iprops.comment.send}</a></div>
                </div>
            </div>
            }
            </div>
            </div>
            <div className="iproductInfo animated fadeIn">
                <div className="iproductHeader">
                <div className="ipiBox ipiBoxLg ipiBoxBack ipiBoxTitle">
                    <h1>{this.state.sql.title ? Dictionary(this.state.sql.title,this.props.senser) : ('عنوان')}</h1>
                    <div className="titleStuff">
                    {!this.state.isLogined && (<div className="tsNotif disabled"></div>)}
                    {!this.state.isLogined && (<div className="tsFave disabled"></div>)}
                    {this.state.isLogined && (<div onClick={this.NoticeMeCoupon} className="tsNotif"></div>)}
                    {this.state.isLogined && (<div className="tsFave" onClick={this.addToFavorite}></div>)}
                    </div>
                </div>
                {imgs.length!=0 ? (<div className="ipiBox ipiGallery">
                {/* <OwlCarousel className="owl-productgallery owl-carousel" options={owlProductGallery}> */}
                    {imgs.map(function(imgitem,i){
                        return (<div key={`ipiGalleryItem-${i}`} className="ipiGalleryItem"><img alt={self.state.sql.title} src={imgitem}/></div>)
                    })}
                {/* </OwlCarousel> */}
                </div>) : ('')}
                {iproductBrand && iproductDesigner ? (<div className="ipiBox mt-1">{iproductBrand}{iproductDesigner}</div>) : ('')}
                {colorscount!=1 ? (<div className="ipiBox ipiBoxLg ipiBoxBack mt-1">
                <span className="ipih1">{iprops.othercolors}:</span>
                <div className="ipiBoxColors mb-15">
                {iproductcolors}
                </div>
                </div>) : ('')}
                <div className="ipiBox ipiBoxLg ipiBoxNormal ipiBoxBack mt-1">
                <span className="ipih1">{iprops.productsizes}{customsew ? (<a className="customsewbtn" onClick={self.customsewbtn}>{iprops.sewingorder}</a>) : (null)}</span>
                <div className="ipiBoxSizes">
                {iproductsizes}
                </div>
                {Object.values(sizedetail).length>2 && (<span className="ipih1">{iprops.sizespecifications}</span>)}
                {Object.values(sizedetail).length>2 && (<div className="sizedetails">{Object.entries(sizedetail).map(function(item,i){
                if(item[0]!='count'){
                    return (<div key={`sizedetail-${i}`} className="sizedetail"><span>{item[0]=='size' ? (iprops.size) : self.ipropsraw(item[0])}</span> : <span>{item[1]}</span></div>);
                    }
                })}</div>)}
                </div>
                
                {self.state.count<=0 && (<div className="ipiBox ipiBoxLg ipiBoxBack mt-1">
                <span className="ipih1">{iprops.unavailable}!</span>
                <p style={{padding:'10px 0'}}>{iprops.unavailablecomment}.</p>
                </div>)}
                {self.state.count<=0 ? (<div className="ipiBox ipibtns mt-1 fixitinmob"><a className="btn customToCart" onClick={this.NoticeMeInventory} style={{'marginLeft':0,'flex':1}}><div className="customToCartMobile"><div className="customToCartBtn">{iprops.letmeknow}</div>{iprops.availablecomment}</div><div className="customToCartDesktop">{iprops.letmeknow}</div></a></div>) : (<div className="ipiBox ipibtns mt-1 fixitinmob"><a className="btn addToCart" data-id={this.state.sql.id} data-img={previewimg} data-title={this.state.sql.title} data-color={color} data-colortitle={colortitle} data-price={colorprice} data-countlimit={self.state.count} data-coupon={couponid} data-offerprice={productprice} data-size={this.state.size} onClick={this.addToCart}>{iprops.addtocart}</a><span className="flex-1 text-center iproductprice"><b>{this.state.price ? (self.mulababy(this.state.price)) : ('قیمت')}</b>{coupon ? (<b>{self.mulababy(productprice)}</b>) : ('')}</span></div>)}
                </div>
                {this.state.sql.about &&
                <div className="ipiBoxi">
                    <p>{nl2br(Dictionary(this.state.sql.about,this.props.senser))}</p>
                </div>
                }
                {this.state.sql.about1 &&
                <div className="ipiBoxi">
                    <h5>{iprops.productdetails}</h5>
                    {this.lister(this.state.sql.about1)}
                </div>
                }
                {this.state.sql.about2 &&
                <div className="ipiBoxi">
                    <h5>{iprops.productdescription}</h5>
                    <p>{nl2br(Dictionary(this.state.sql.about2,this.props.senser))}</p>
                </div>
                }
                {this.state.sql.about3 &&
                <div className="ipiBoxi">
                    <h5>{iprops.howtocare}</h5>
                    {this.lister(this.state.sql.about3)}
                </div>
                }
            {this.state.tags.length!=0 &&
            <div className='ipiBoxi'>
                <div className="ipiBoxi_tags">
                {this.state.sql.tag ? this.state.sql.tag.split(',').map((tag,tagkey)=>{
                    let tagname='404';
                    let tagslug='';
                    self.state.tags.map((realtag)=>{
                        if(realtag.id==tag){ tagname=realtag.title;tagslug=realtag.slug }
                    })
                    if(tagname!='404'){
                    return (<Link href={`/categories/?discount=false&tag=${tagslug}`} key={`iproducttag-${tagkey}`}><a className="ipiBoxi_tag">{tagname}</a></Link>)
                    }
                }) : self.state.sql.tag}
                </div>
            </div>
            }
            {completeyourstyle && (<div className="completeyourstyle">
                <h5>{iprops.completeyourstyle}</h5>
                <div className="completeyourstylerow">
                {Object.values(self.state.completeyourstyle).map(function(value,valuekey){
                        const goldenkey=value.id+'#'+value.colorurl
                        if(completeyourstyleArr.includes(goldenkey)){
                        let brandname='';
                        if(self.props.designers){
                            self.props.designers.forEach(function(item,i){
                                if(value.designer==item.id){
                                    brandname=item.brand;
                                }
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
                        return (<Link key={`completeyourstyle-0-${valuekey}`} href={`/product-${value.pid}/${encodeURIComponent(encodeUrl(producturl))}#${encodeUrl(value.colorurl)}`}><a className={`completeyourstylecol`}>
                        <div className="completeyourstylecolimg"><img alt={value.title+' '+value.colortitle} src={value.img}/>{coupon ? (<span className="catpreviewcoupon">% {self.toEnglishDigits(couponpercent.toString())}</span>) : ('')}</div>
                        <div className="completeyourstylecolbrand">{brandname}</div>
                        <div className="completeyourstylecoltitle" data-for={`enrich`} data-tip={value.title+' '+value.colortitle}>{self.substrBytes(value.title,0,30)==value.title ? (value.title) : (self.substrBytes(value.title,0,30)+'...')}</div>
                        {value.count==0 ? (<div className="completeyourstylecolprice"><span>{iprops.unavailable}</span></div>) : (<>
                        <div className="completeyourstylecolprice"><span>{self.mulababy(value.price)}</span>{coupon ? (<span>{self.mulababy(productprice)}</span>) : ('')}</div>
                        </>)}
                        </a></Link>);
                        }
                })}
                
                    {/* <Link to="#" class="completeyourstylecol">
                        <div class="completeyourstylecolimg"><Image layout="fill" objectFit="contain" src="/images/marjanprotected-1604562145.jpg"/></div>
                        <div class="completeyourstylecolbrand">A2 by matin</div>
                        <div class="completeyourstylecoltitle">شلوار خاکستری خمره ای</div>
                        <div class="completeyourstylecolprice">۳۵۰,۰۰۰ تومان</div>
                    </Link>
                    <Link class="completeyourstylecol">
                        <div class="completeyourstylecolimg"><Image layout="fill" objectFit="contain" src="/images/marjanprotected-1604562145.jpg"/></div>
                        <div class="completeyourstylecolbrand">A2 by matin</div>
                        <div class="completeyourstylecoltitle">شلوار خاکستری خمره ای</div>
                        <div class="completeyourstylecolprice">۳۵۰,۰۰۰ تومان</div>
                    </Link> */}
                </div>
            </div>)}
            </div>
            </div>) : null}
            {this.state.sql.title ? null : (<div className="iproductLoading"></div>)}
            {self.state.customize ? (<div className="iproductCustomize">
                {imgs.length!=0 ? (<div className="iproductCustomizeGallery">
                    {imgs.map(function(imgitem,i){
                        return (<div key={`iproductCustomizeGalleryItem-${i}`} className="iproductCustomizeGalleryItem"><img alt={self.state.sql.title} src={imgitem}/></div>)
                    })}
                </div>) : null}
                <div className="iproductCustomizeForm">
                <div className="iproductCustomizeFormTitle">{title}</div>
                <div className="iproductCustomizeFormBullet">سفارش دهنده: {self.state.userName}</div>
                <div className="iproductCustomizeFormBullet">{iprops.designer}: {self.state.sql.designer}</div>
                <div className="iproductCustomizeFormInput iproductCustomizeFormInput-color">
                    <div className="iproductCustomizeFormInputLabel" onClick={self.customizeforminputtoggle.bind(this)}>لطفا رنگ خود را انتخاب کنید</div>
                    <div className="iproductCustomizeFormInputContent noselect">
                        {customsewcolors.map(function(item,i){
                            return (<div key={`iproductCustomizeFormInputContentOption-${i}`} onClick={self.customizecolorselector.bind(this)} className={`iproductCustomizeFormInputContentOption${self.state.customizecolor==item ? (' active') : ''}`}>{item}</div>)
                        })}
                    </div>
                </div>
                <div className="iproductCustomizeFormInput iproductCustomizeFormInput-sizes">
                    <div className="iproductCustomizeFormInputLabel" onClick={self.customizeforminputtoggle.bind(this)}>لطفا اندازه های خود را وارد کنید</div>
                    <div className="iproductCustomizeFormInputContent noselect">
                    {customsewsizes.map(function(item,i){
                        return(<React.Fragment key={`iproductCustomizeFormInputPut3-${i}`}><div key={`iproductCustomizeFormInputPut-${i}`} className="iproductCustomizeFormInputPut"><label>{item[0]}</label><input data-key={i} data-min={item[1]} data-max={item[2]} onChange={self.inputLabeler.bind(this)} type="text"/><span>سانتی متر</span></div><div key={`iproductCustomizeFormInputPut2-${i}`} className={`iproductCustomizeFormInputPutError iproductCustomizeFormInputPutError-${i}`}><span>حداقل اندازه برای ثبت سفارش {item[1]} سانتی متر می باشد.</span><span>حداکثر اندازه برای ثبت سفارش {item[2]} سانتی متر می باشد.</span></div></React.Fragment>)
                    })}
                    <a href={self.props.config && self.props.config.sizehelperImg} target="_blank" rel="noreferrer" className="iproductCustomizeFormHelp">راهنمای اندازه گیری</a>
                    </div>
                </div>
                <div className="iproductCustomizeFormFooter">
                <a className="btn" onClick={self.checkcustomize}>ثبت اطلاعات</a>
                <a className="btn btn-nofill" onClick={self.closecustomize}>بازگشت</a>
                </div>
                </div>
            </div>) : null}
            
            {this.state.sql.title && (<React.Fragment>
            <ProductGrabber title={iprops.similarproducts} {...this.props} slider={true} sql={this.state.sql} coupons={this.props.coupons} products={this.state.related} userData={this.state.userData} />
            <ProductGrabber title={iprops.recentvisits} {...this.props} slider={true} sql={this.state.sql} coupons={this.props.coupons} products={this.state.lastvisits} userData={this.state.userData} />
            {/* <div className="container-cafca probox">
                <h2>محصولات مشابه</h2>
                <RelatedProducts {...this.props} slider={true} sql={this.state.sql} coupons={this.props.coupons} products={this.state.related} userData={this.state.userData}/>
            </div> */}
            {/* {this.state.userData && (<div className="container-cafca probox">
                <h2>بازدید های اخیر</h2>
                <Lastvisits {...this.props} products={this.state.lastvisits} sql={this.state.sql} hiddencurrent={true} coupons={this.props.coupons} lastvisits={this.props.lastvisits} slider={true} userData={this.state.userData}/>
            </div>)} */}
            </React.Fragment>)}
        </div>
        <div className={`notifyArea${this.state.showNotif ? (' active') : ('')}`}>
                <div className="notify">
                <div className="notifyTitle"><div className="notifyCloserIcon" onClick={this.NotifCloser}></div><span>{NotifTitle}</span></div>
                <div className="notifyContent">
                    {this.state.isLogined ? (<React.Fragment>
                    <img alt="check" src="/img/icon-check-mark.svg" className="animated fadeIn delay-1s" style={{marginBottom:'15px'}} />
                    {this.state.notifStatus=='inventory' ? (<p>{iprops.notify.inventorytext}.</p>) : (<p>{iprops.notify.coupontext}.</p>)}
                    </React.Fragment>) : (<Login locale={this.props.locale} tiny={true} checkLogin={this.checkLogin} parent="dashboard" />)}
                    
                </div>
                {this.state.isLogined && <div className="btn" onClick={this.NotifCloser}>{iprops.realized}</div>}   
                </div>
            <div className="notifyCloser" onClick={this.NotifCloser}></div>
        </div>
        </React.Fragment>)
    }
})