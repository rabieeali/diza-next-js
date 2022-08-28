import React, { Component } from 'react';
import DbConfig from './DbConfig';
import $ from 'jquery';
import {postData} from '../lib/postData';
import Link from 'next/link';
import ProductGrabber from './ProductGrabber';
import translate from '@/config/translate';
// import OwlCarousel from 'react-owl-carousel2';

export default class Lastvisits extends Component {
    constructor(props){
        super(props);
        this.state={
            products:[],userData:false,datageted:false
        }
        this.getLastVisits = this.getLastVisits.bind(this);
        this.goProduct = this.goProduct.bind(this);
    }
    componentDidMount(){
        this.getLastVisits();
    }
    componentDidUpdate(prevProps){
        if (prevProps.userData !== this.props.userData){
        this.getLastVisits();
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
    getLastVisits(){
        const self=this;
        if(this.props.userData && !this.state.datageted){
        this.setState({'userData':this.props.userData});
        let updateData={locale:this.props.locale,userphone:JSON.parse(this.props.userData).userphone}
        // must be load in the master
        postData('getlastvisits',updateData).then((result)=>{
            self.setState({products:self.productscleaner(result.products),datageted:true},()=>{
                setTimeout(function(){
                    $(".owl-productLastvisits").trigger('refresh.owl.carousel');
                },300);
            })
        });
        // alert(this.state);
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
        const iprops=translate[this.props.locale]
        return <ProductGrabber title={iprops.recentvisits} {...this.props} sql={true} minimal={true} slider={true} coupons={this.props.coupons} products={this.state.products} userData={this.state.userData} />
    }
}