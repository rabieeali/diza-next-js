import React, { Component } from 'react';
import Router, { withRouter, useRouter } from 'next/router'
import {connect} from 'react-redux';
import Link from 'next/link'
import $ from 'jquery';
import axios from 'axios';
import DbConfig from './DbConfig.js';
import {postData} from '../lib/postData';
// import {postData} from './postData';
import {forEach, isSet} from 'lodash';
import InputRange from 'react-input-range-rtl';
import 'react-input-range-rtl/lib/css/index.css';
import ReactTooltip from 'react-tooltip';
import translate from '@/config/translate.js';
// import ReactPaginate from 'react-paginate';
// import ReactPaginate from 'react-paginate';
// import { Pagination } from "@material-ui/lab";
// import usePagination from './Pagination';
// import CategoriesHeart from './CategoriesHeart';
// import ReactUltimatePagination from 'react-ultimate-pagination';
import Dictionary from './Dictionary';
import { unmountComponentAtNode } from 'react-dom';

let PageSize = 10;

export default withRouter(class Categories extends Component {
    constructor(props){
        super(props);
        this.state={
            products:false,
            filterdProducts:[],
            url:this.props.router.query.url,
            loading:true,
            minimizeFilter:false,
            filterPrice:[],
            preprice:{min:0,max:30000000},
            price:{min:0,max:30000000},
            designer:false,
            catparent:'',
            title:'دسته بندی',
            redirect:'',
            navpoint:false,
            sort:'',
            tag:false,
            sortset:false,
            onlydiscount:false,
            totalresults:0,
            paginationloading:false,
            page:0,
            offset:0,
            perPage:40,
            currentPage:0,
            queryloading:true
        }
        this.goBack = this.goBack.bind(this);
        this.minimizeFilter = this.minimizeFilter.bind(this);
        this.maximizeFilter = this.maximizeFilter.bind(this);
        this.sortByValuable = this.sortByValuable.bind(this);
        this.sortByCutrate = this.sortByCutrate.bind(this);
        this.sortByNewest = this.sortByNewest.bind(this);
        this.sortByHit = this.sortByHit.bind(this);
        this.sortSystem = this.sortSystem.bind(this);
        this.sorter = this.sorter.bind(this);
        this.filterDesigner = this.filterDesigner.bind(this);
        this.filterSex = this.filterSex.bind(this);
        this.filterPriceInput = this.filterPriceInput.bind(this);
        this.setPriceInQuery = this.setPriceInQuery.bind(this);
        this.Catje = this.Catje.bind(this);
        this.productSorter = this.productSorter.bind(this);
        this.addQuery = this.addQuery.bind(this);
        this.deleteQuery = this.deleteQuery.bind(this);
        this.queryConfig = this.queryConfig.bind(this);
        this.goProduct = this.goProduct.bind(this);
        this.onlydiscount = this.onlydiscount.bind(this);
        this.fordis = this.fordis.bind(this);
        this.productTitle = this.productTitle.bind(this);
        this.paginationHandle = this.paginationHandle.bind(this);
        this.setFilterPrice = this.setFilterPrice.bind(this);
        this.tagcloser = this.tagcloser.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }
    componentDidMount(){
        this.queryConfig(true);
        $('header,nav').addClass('minimize');
        // this.productUpdate();
        $('.filterhead').bind('click',function(){
            let currhead=$(this).parent();
            if(currhead.hasClass('active')){
                $('.filterbox').removeClass('active');
                currhead.removeClass('active');
            }else{
                $('.filterbox').removeClass('active');
                currhead.addClass('active');
            }
            // $(this).parent().toggleClass('active');
        });
        const {sex,nav,parent,title,term} = this.routerpath();
        // const {nav,parent,title,sex,term} = this.props.router.query;
        if(nav){
            $('.filterbox-categories').addClass('active');
            if(title){
                // $('.catje').addClass('active');
                $('.catje.active .superactive').parents('.catje').addClass('active');
            }
        }
        window.addEventListener('scroll', this.onScroll, false);
    }
    // shouldComponentUpdate(nextProps, nextState){
    //     if(nextState.products!=[]){return true}else{return false}
    // }
    componentDidUpdate(prevProps,prevState,snapshot){
        const Matchurl = window.location.pathname, self = this;
        if(this.state.url!=Matchurl){
            this.setState({'url':Matchurl},()=>{
                self.productUpdate();
            });
        }else{
            if(!this.deepEqual(prevProps.router.query,this.props.router.query)){
                this.queryConfig();
            }
        }
        if(prevProps.navList!=this.state.navList){
            $('.catje.active .superactive').parents('.catje').addClass('active');
        }
        if(prevState.onlydiscount!=this.state.onlydiscount){this.productTitle();}
    }
    queryConfig(init=false){
        const query=this.props.router.query;
        let sort,pricing,discount,tag,designer=null;
        if(query){
            const searchParams=new URLSearchParams(this.props.router.query);
            sort=searchParams.get("sort");
            pricing=searchParams.get("pricing");
            designer=searchParams.get("designer");
            discount=searchParams.get("discount");
            tag=searchParams.get("tag");
            if(discount && discount=='true'){
                this.setState({onlydiscount:true});
            }else{
                this.setState({onlydiscount:false});
            }
            if(tag && tag!=''){
                this.setState({tag:tag});
            }else{
                this.setState({tag:false})
            }
            if(pricing){
                pricing=pricing.split('-');
                this.setState({price:{min:parseInt(pricing[0]),max:parseInt(pricing[1])},preprice:{min:parseInt(pricing[0]),max:parseInt(pricing[1])}});
                $('.filterPriceAreaInputMin').val(this.mulababy(pricing[0],true));
                $('.filterPriceAreaInputMax').val(this.mulababy(pricing[1],true));
            }
            if(designer){
                designer=designer.split('-');
                if(designer[0]=='all'){designer=false}
                this.setState({designer:designer});
            }
        }
        if(!this.state.sortset && !sort && this.props.config){sort=this.props.config.defaultsort;}
        if(!init){
            // this.sorter(sort);
        }else{this.setState({sort:sort})}
        this.setState({queryloading:false})
    }
    sorter(sort){
        if(sort && sort=='most-popular'){this.sortByHit(this.backToPosition());}
        if(sort && sort=='the-newest'){this.sortByNewest(this.backToPosition());}
        if(sort && sort=='lowest-price'){this.sortByCutrate(this.backToPosition());}
        if(sort && sort=='highest-price'){this.sortByValuable(this.backToPosition());}
    }
    backToPosition(){
        let goproduct=localStorage.getItem('goproduct');
        if(typeof goproduct !== 'undefined' && goproduct !== null){
            let getproductelement=$('.iproduct-'+goproduct);
            if(getproductelement.length!=0){
            setTimeout(function(){
                getproductelement=$('.iproduct-'+goproduct);
                let goproductint=parseInt(getproductelement.offset().top);
                if($(window).width()<1000){goproductint=goproductint-100;}
                $('html,body').animate({scrollTop:goproductint},100);
            },300);
            }
            localStorage.removeItem('goproduct');
        }
    }
    deepEqual(x, y){
        const ok = Object.keys, tk = this, tx = typeof x, ty = typeof y;
        return x && y && tx === 'object' && tx === ty ? (
          ok(x).length === ok(y).length &&
            ok(x).every(key => tk.deepEqual(x[key], y[key]))
        ) : (x === y);
    }
    productTitle(){
        this.setState({title:this.props.title});
    }
    routerpath(){
        let sex,nav,parent,title,term;
        if (typeof window !== "undefined") {
            const location = window.location.pathname;
            const pathname=location.split('/')
            pathname.map((value,slukey)=>{
                value=decodeURIComponent(value)
                if(this.props.locale!='fa'){slukey-=1}
                switch(slukey){
                    case 2: sex=value; break;
                    case 3: nav=value; break;
                    case 4: title=value; break;
                }
            })
            if(this.props.router.query.term){
                term = decodeURIComponent(location.substring(location.lastIndexOf("/") + 1));
                sex=null
            }
        }
        return {sex,nav,parent,title,term}
    }
    productUpdate(havesort=false,havepage=false,callback=false,discount=false){
        let self=this,products=[],parent,{navpoint,page,sort,designer}=this.state;
        if(havesort){sort=havesort}
        if(havepage){page=havepage,products=this.state.products}else{page=0}
        if(this.state.onlydiscount){discount=true}
        this.setState({loading:true,totalresults:0,catparent:'',products:products,filterdProducts:products});
        const {sex,nav,title,term} = this.routerpath();
        console.log({sex,nav,title,term,sort},'pro')
        let decodeUrl=(str)=>{return str.replace(/-/g, ' ')}
        this.productTitle();
        // axios.post('/:api:products',{'nav':nav,'parent':parent,'title':title,'sex':sex,'term':term})
        if(!navpoint){
            console.log(connect,'connect');
            // navpoint=this.props.
        }
        let goproduct=localStorage.getItem('goproduct');
        let goproduct_page=localStorage.getItem('goproduct_page');
        if(typeof goproduct !== 'undefined' && goproduct !== null && typeof goproduct_page !== 'undefined' && goproduct_page !== null){ goproduct_page=parseInt(goproduct_page); }else{ goproduct_page=0 }
        let perPage = goproduct_page==0 ? this.state.perPage : goproduct > this.state.perPage ? parseInt(goproduct) : (goproduct_page*this.state.perPage);
        postData('products',{'locale':self.props.locale,'nav':nav,'parent':parent,'title':title,'sex':sex,'term':term,'designer':designer,'sort':sort,'page':page,perPage,discount:discount},true)
        .then(response=>{
            console.log(response,'res ine')
            let uniqKEY=products.length;
            Object.values(response.result).map(function(valP,keyP){
                valP.colors.forEach(function(item,index){
                    products[uniqKEY]=[];
                    products[uniqKEY].brand=valP.brand;
                    let itemImg=item.img.split(',');
                    if(item.thumbnail==''){products[uniqKEY].img=itemImg[0];}else{products[uniqKEY].img=item.thumbnail;}
                    products[uniqKEY].title=valP.title;
                    products[uniqKEY].colortitle=item.title;
                    products[uniqKEY].colorurl=item.url;
                    products[uniqKEY].url=valP.url;
                    products[uniqKEY].id=uniqKEY;
                    products[uniqKEY].sales=item.sales;
                    products[uniqKEY].pid=valP.id;
                    products[uniqKEY].designer=valP.designer;
                    products[uniqKEY].price=item.price;
                    products[uniqKEY].tag=valP.tag;
                    products[uniqKEY].sex=valP.sex;
                    products[uniqKEY].catparent=valP.catparent;
                    products[uniqKEY].customsew=valP.customsew;
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
                });
            });
            this.setState({totalresults:response.count,products:products,filterdProducts:products,page,currentPage:page},()=>{
                this.setState({'loading':false});
                if(!callback){ this.backToPosition() }else{ callback() }
                if(!havesort){ this.queryConfig(); }
            });
        }).catch(errors=>{console.log(errors);});
        setTimeout(function(){$('.navCat a').each(function(){
            if($(this).html()==nav){$(this).addClass('superactive');}
        });},1000);
        this.setState({'currentparams':[nav,parent,title,sex]});
    }
    isJSON(str) {
        try {
            return (JSON.parse(str) && !!str);
        } catch (e) {
            return false;
        }
    }
    goBack(e,b=true){
        const self=this;
        let before=window.location.href;
        // const router = useRouter();
        // router.back();
        // this.props.history.goBack();
        window.history.back()
        setTimeout(function(){
        let after=window.location.href;
        if(before==after){self.goBack(e,false)}    
        },100);
        if(b){
        let btn=$(e.currentTarget);
        btn.addClass('clicked');
        setTimeout(function(){btn.removeClass('clicked');},400);
        }
    }
    paginationProccess(){
        const self=this;
        if(!self.state.paginationloading && self.state.totalresults>self.state.filterdProducts.length){
            this.setState({paginationloading:true,currentPage:self.state.page+1},()=>{
                self.productUpdate(self.state.sort,self.state.page+1,()=>self.setState({paginationloading:false}));
            })
        }
    }
    onScroll(r){
        const { pageYOffset, scrollY, innerHeight } = window;
        const { loading, paginationloading } = this.state;
        const deadline = document.body.scrollHeight - (innerHeight*2);
        let callbus=false;
        if(scrollY>deadline && !callbus && !loading && !paginationloading){
            callbus=true;
            this.paginationProccess()
        }
        // console.log("yOffset", pageYOffset, "scrollY", scrollY, "deadline", deadline);
    }
    tagcloser(){
        this.deleteQuery('tag');
        this.setState({tag:false})
    }
    minimizeFilter(){
        this.setState({'minimizeFilter':true});
        $('body').removeClass('maximizeFilter');
    }
    maximizeFilter(){
        this.setState({'minimizeFilter':false});
        $('body').addClass('maximizeFilter');
    }
    componentWillUnmount(){
        $('header,nav').removeClass('minimize');
        $('.navCat a').removeClass('superactive');
        $('.filterhead').unbind('click');
        window.removeEventListener('scroll', this.onScroll, false);
    }
    undeed(str){var id = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];return str.replace(/[0-9]/g, function (w) {return id[+w];});}
    toEnglishDigits(str){if(this.props.locale!='fa' && this.props.locale!='ar'){return str}var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];return str.replace(/[0-9]/g, function (w) {return id[+w];});}
    numberWithCommas(x){return this.toEnglishDigits(x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));}
    mulababy(cash,raw=false,reverse=false){
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
            return cash
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
    sortSystem(type='the-newest'){
        const self=this;
        switch(type){
            case 'highest-price': self.sortByValuable(self.productUpdate('highest-price')); break;
            case 'lowest-price': self.sortByCutrate(self.productUpdate('lowest-price')); break;
            case 'most-popular': self.sortByHit(self.productUpdate('most-popular')); break;
            default : self.sortByNewest(self.productUpdate('the-newest')); break;
        }
    }
    sortByValuable(callback=()=>{}){
        // const {filterdProducts} = this.state;
        // let newProdList = filterdProducts.reverse();
        this.addQuery('sort','highest-price');
        this.setState({sortset:true,sort:'highest-price'},callback());
        // this.setState({sortset:true,sort:'highest-price',filterdProducts:newProdList.sort((a,b)=>b.price - a.price || b.id - a.id)},callback());
    }
    sortByCutrate(callback=()=>{}){
        // const {filterdProducts} = this.state;
        // let newProdList = filterdProducts.reverse();
        this.addQuery('sort','lowest-price');
        this.setState({sortset:true,sort:'lowest-price'},callback());
        // this.setState({sortset:true,sort:'lowest-price',filterdProducts:newProdList.sort((a,b)=>a.price - b.price || b.id - a.id)},callback());
    }
    sortByHit(callback=()=>{}){
        // const {filterdProducts} = this.state;
        this.addQuery('sort','most-popular');
        this.setState({sortset:true,sort:'most-popular'},callback());
        // this.setState({sortset:true,sort:'most-popular',filterdProducts:filterdProducts.sort((a,b)=>b.views - a.views || b.id - a.id)},callback());
    }
    sortByNewest(callback=()=>{}){
        // const {filterdProducts} = this.state;
        // let newProdList = filterdProducts.reverse();
        this.addQuery('sort','the-newest');
        this.setState({sortset:true,sort:'the-newest'},callback());
        // this.setState({sortset:true,sort:'the-newest',filterdProducts:newProdList.sort((a,b)=>b.pid - a.pid || b.id - a.id)},callback());
    }
    deleteQuery(key){
        let pathname = window.location.pathname;
        let searchParams = new URLSearchParams(window.location.search);
        searchParams.delete('slug');
        searchParams.delete('term');
        searchParams.delete(key);
        // this.props.history.push({
        Router.push({
            pathname: pathname,
            search: searchParams.toString()
        });
    }
    // static getInitialProps({ pathname }){
    //     return { pathname }
    // }
    // static async getInitialProps({req}) {
    //     return req.params;
    // }
    addQuery(key,value){
        let pathname = window.location.pathname
        let searchParams = new URLSearchParams(window.location.search);
        searchParams.delete('slug');
        searchParams.delete('term');
        searchParams.set(key, value);
        // this.props.history.push({
        Router.push({
            pathname: pathname,
            query: searchParams.toString()
        });
    }
    currQuery(){
        // console.log 
        let searchParams=[]
        if(typeof window !== 'undefined'){
        searchParams = new URLSearchParams(window.location.search)
        }
        return searchParams.toString()
    }
    filterCat(e) {
        const filterCat= e.target.value;
        // alert(filterCat);
    }
    filterSex(e){
        let sexs=[];
        let filterSex=$('input[name="filterSex[]"]:checked');
        Object.values(filterSex).map(function(value,key){
        if(value.value){sexs.push(value.value);}
        });
        if(e.target.value!='all'){
            $('input[name="filterSex[]"][value="all"]').prop('checked',false);
        }else{
            $('input[name="filterSex[]"]').prop('checked',false);
            $('input[name="filterSex[]"][value="all"]').prop('checked',true);
        }
        // if(sexs.length!=1)
        // console.log(sexs);
        // 
        // $('#myCheckbox').attr('checked', false);

        // const filterSex=e.target.value;
        // console.log(this.refs.filterSex.checked);
        const {products} = this.state;
        let newProdList = [];
        products.map(function(item){
            if(sexs.includes(item.sex) || sexs.includes('all')){
            newProdList.push(item);
            }
        });
        this.setState({filterdProducts:newProdList})
    }
    filterDesigner(e) {
        const self=this;
        if(e.target.value!='all'){
            $('input[name="filterDesigner[]"][value="all"]').prop('checked',false);
        }else{
            $('input[name="filterDesigner[]"]').prop('checked',false);
            $('input[name="filterDesigner[]"][value="all"]').prop('checked',true);
        }
        let designers=[];
        let filterDesigner=$('input[name="filterDesigner[]"]:checked');
        Object.values(filterDesigner).map(function(value,key){
        if(value.value){designers.push(value.value);}
        });
        this.addQuery('designer',designers.join('-'));
        if(designers[0]=='all'){designers=false}
        this.setState({designer:designers},()=>{
            self.productUpdate();
        });
        // let filterDesigner=e.target.value;
        // if(filterDesigner=="0"){filterDesigner=false;}
        // this.setState({designer:[filterDesigner]});
    }
    setPriceInQuery(e){
        this.addQuery('pricing',e.min+'-'+e.max);
        $('.filterPriceAreaInputMin').val(e.min);
        $('.filterPriceAreaInputMax').val(e.max);
    }
    filterPriceInput(e){
        let value=parseInt(e.target.value);
        let rel=e.target.dataset.rel;
        if(!value && rel=='min'){value=0;}else if(!value && rel=='max'){value=999999999;}else{ value=this.mulababy(value,true,true) }
        console.log(value);
        this.setState(prevState => {
            let preprice = Object.assign({}, prevState.preprice);
            preprice[rel] = value; 
            // this.setPriceInQuery(price);
            return { preprice };
        });
    }
    setFilterPrice(){
        this.setPriceInQuery(this.state.preprice);
    }
    filterPrice(e) {
        const filterPrice = e.target.value
        let newProdList = this.state.products;
        if(filterPrice==0){
        this.setState({filterdProducts:newProdList})
        }else if(filterPrice==1){
            this.setState({filterdProducts:newProdList.filter((x)=>x.price < 500000)})
        }else if(filterPrice==2){
            this.setState({filterdProducts:newProdList.filter((x)=>x.price < 1000000 && x.price > 500000)})
        }else if(filterPrice==3){
            this.setState({filterdProducts:newProdList.filter((x)=>x.price < 1500000 && x.price > 1000000)})
        }else if(filterPrice==4){
            this.setState({filterdProducts:newProdList.filter((x)=>x.price < 2000000 && x.price > 1500000)})
        }else if(filterPrice==5){
            this.setState({filterdProducts:newProdList.filter((x)=>x.price < 2500000 && x.price > 2000000)})
        }else if(filterPrice==6){
            this.setState({filterdProducts:newProdList.filter((x)=>x.price > 2500000)})
        }
        
    }
    substrBytes(str, start, length){
    let buf=str;
    return buf.slice(start, start+length).toString();
    }
    Catje(e){
        let parent=$(e.currentTarget).data('parent');
        if($(e.currentTarget).parent().hasClass('active')){
            $(e.currentTarget).parent().parent().find('.catje').removeClass('active');
            parent=parent.split(',').slice(0, -1).toString();
        }else{
            $(e.currentTarget).parent().parent().find('.catje').removeClass('active');
            $(e.currentTarget).parent().addClass('active'); 
        }
        // this.setState({catparent:parent});
    }
    productSorter(e) {
        $(e.currentTarget).toggleClass('active');
    }
    goProduct(e){
        localStorage.setItem('goproduct',e.currentTarget.dataset.key);
        localStorage.setItem('goproduct_page',this.state.currentPage);
    }
    onlydiscount(){
        // this.sortSystem(this.state.sort);
        let self=this;
        if(this.state.onlydiscount){
            // self.setState({onlydiscount:false},()=>{self.addQuery('discount','false');self.productTitle();});
            self.setState({onlydiscount:false},()=>{self.addQuery('discount','false');self.productTitle();self.fordis(false);});
        }else{
            // self.setState({onlydiscount:true},()=>{self.addQuery('discount','true');self.productTitle();});
            self.setState({onlydiscount:true},()=>{self.addQuery('discount','true');self.productTitle();self.fordis(true);});
        }
    }
    fordis(discount){
        this.productUpdate(this.state.sort,false,()=>{},discount)
    }
    paginationHandle(e){
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;
    this.setState({
        currentPage: selectedPage,
        offset: offset
    }, () => {
        $('html,body').animate({scrollTop:$('.categories').offset().top},100);
        // alert('change');
        // this.receivedData()
    });
    }
    render() {
        if(this.state.redirect){
            this.state.redirect(this.state.redirect);
        }
        const iprops=translate[this.props.locale]
        const self=this;
        let encodeUrl=(str)=>{return str.replace(/ /g,'-')}
        let decodeUrl=(str)=>{return str.replace(/-/g, ' ')}
        const {sex,nav,parent,title,term} = this.routerpath();
        // const {nav,parent,title,sex,term} = this.props.router.query;
        const toNav=encodeUrl('/categories/'+sex+'/'+nav);
        const toParent='/categories/'+nav+'/'+parent;
        const toSex=encodeUrl('/categories/'+sex);
        const toTitle=encodeUrl('/categories/'+sex+'/'+nav+'/'+title);
        let tag_init=false;
        let tag_id=false;
        if(this.state.tag && this.props.tags){
            let tagname='404';
            self.props.tags.map((realtag)=>{
                if(self.state.tag==realtag.slug){
                    tagname=realtag.title;
                    tag_id=realtag.id;
                }
            })
            tag_init=(<a># {tagname}</a>)
        }
        let CategoriesNav=[];
        let CategoriesTitle=[];
        let Value=[];
        Value[iprops.sex.women]=[];
        Value[iprops.sex.men]=[];
        Value[iprops.sex.children]=[];
        for (const [keyA, valueA] of Object.entries(self.props.navList)) {
            for (const [keyB, valueB] of Object.entries(valueA)) {
                if(keyA==iprops.sex.unisexadult){
                    Value[iprops.sex.women][keyB]=[];
                    Value[iprops.sex.men][keyB]=[];
                    if(sex==encodeUrl(iprops.sex.unisexadult)){CategoriesNav[keyB]=[];} 
                }
                if(keyA==iprops.sex.women){
                    Value[iprops.sex.women][keyB]=[];
                    if(sex==encodeUrl(iprops.sex.women)){CategoriesNav[keyB]=[];}
                }
                if(keyA==iprops.sex.men){
                    Value[iprops.sex.men][keyB]=[];
                    if(sex==encodeUrl(iprops.sex.men)){CategoriesNav[keyB]=[];}
                }
                if(keyA==iprops.sex.unisexchild){
                    Value[iprops.sex.children][keyB]=[];
                    if(sex==encodeUrl(iprops.sex.unisexchild)){CategoriesNav[keyB]=[];}
                }
                if(keyA==iprops.sex.boy || keyA==iprops.sex.girl){
                    Value[iprops.sex.children][keyB]=[];
                    if(sex==encodeUrl(iprops.sex.girl) || sex==encodeUrl(iprops.sex.boy) || sex==encodeUrl(iprops.sex.children)){CategoriesNav[keyB]=[];}
                }

            }
        }
        for (const [keyA, valueA] of Object.entries(self.props.navList)) {
            for (const [keyB, valueB] of Object.entries(valueA)) {
                for(const [keyC, valueC] of Object.entries(valueB)) {
                    let valueCpp=[];
                    if(valueC.parent && valueC.parent!=''){valueCpp=valueC.parent.split(',');}
                    if(keyA==iprops.sex.unisexadult){
                        if(sex==encodeUrl(iprops.sex.unisexadult) && nav==encodeUrl(valueC.nav)){CategoriesTitle[valueC.title]=[];}
                    }
                    if(keyA==iprops.sex.men){
                        Value[iprops.sex.men][keyB].push(valueC);
                        if((sex==encodeUrl(iprops.sex.men)) && nav==encodeUrl(valueC.nav)){CategoriesTitle[valueC.title]=[];}
                    }
                    if(keyA==iprops.sex.women){
                        Value[iprops.sex.women][keyB].push(valueC);
                        if((sex==encodeUrl(iprops.sex.women)) && nav==encodeUrl(valueC.nav)){CategoriesTitle[valueC.title]=[];}
                    }
                    if(keyA==iprops.sex.unisexchild){
                        Value[iprops.sex.children][keyB].push(valueC);
                        if((sex==encodeUrl(iprops.sex.unisexchild)) && nav==encodeUrl(valueC.nav)){CategoriesTitle[valueC.title]=[];}
                    }
                    if(keyA==iprops.sex.boy || keyA==iprops.sex.girl){
                        Value[iprops.sex.children][keyB].push(valueC);
                        if((sex==encodeUrl(iprops.sex.girl) || sex==encodeUrl(iprops.sex.boy) || sex==encodeUrl(iprops.sex.children)) && nav==encodeUrl(valueC.nav)){CategoriesTitle[valueC.title]=[];}
                    }
                    valueCpp.forEach(function(catgroup,catgroupkey){
                    if(((keyA==iprops.sex.boy || keyA==iprops.sex.girl) && (sex==encodeUrl(iprops.sex.girl) || sex==encodeUrl(iprops.sex.boy) || sex==encodeUrl(iprops.sex.children))) || ((keyA==iprops.sex.unisexchild) && (sex==encodeUrl(iprops.sex.unisexchild))) || (keyA==iprops.sex.women && sex==encodeUrl(iprops.sex.women)) || (keyA==iprops.sex.men && sex==encodeUrl(iprops.sex.men)) || (keyA==iprops.sex.unisexadult && sex==encodeUrl(iprops.sex.unisexadult))){
                        if(catgroupkey==0 && keyB!='' && CategoriesNav[keyB] && !CategoriesNav[keyB][valueCpp[0]]){
                            CategoriesNav[keyB][valueCpp[0]]=[];
                        }else if(catgroupkey==1 && keyB!='' && valueCpp[1] && CategoriesNav[keyB][valueCpp[0]] && !CategoriesNav[keyB][valueCpp[0]][valueCpp[1]]){
                            CategoriesNav[keyB][valueCpp[0]][valueCpp[1]]=[];     
                        }else if(catgroupkey==2 && keyB!='' && valueCpp[2] && CategoriesNav[keyB][valueCpp[0]][valueCpp[1]]){
                            CategoriesNav[keyB][valueCpp[0]][valueCpp[1]][valueCpp[2]]=[];
                        }else if(catgroupkey==3 && keyB!='' && valueCpp[3] && CategoriesNav[keyB][valueCpp[0]][valueCpp[1]][valueCpp[2]]){
                            CategoriesNav[keyB][valueCpp[0]][valueCpp[1]][valueCpp[2]][valueCpp[3]]=[];
                        }else if(catgroupkey==4 && keyB!='' && valueCpp[4] && CategoriesNav[keyB][valueCpp[0]][valueCpp[1]][valueCpp[2]][valueCpp[3]]){
                            CategoriesNav[keyB][valueCpp[0]][valueCpp[1]][valueCpp[2]][valueCpp[3]][valueCpp[4]]=[];
                        }else if(catgroupkey==5 && keyB!='' && valueCpp[5] && CategoriesNav[keyB][valueCpp[0]][valueCpp[1]][valueCpp[2]][valueCpp[3]][valueCpp[4]]){
                            CategoriesNav[keyB][valueCpp[0]][valueCpp[1]][valueCpp[2]][valueCpp[3]][valueCpp[4]][valueCpp[5]]=[];
                        }
                    }
                    });
                    if(keyB && CategoriesNav[keyB]){
                    if(((keyA==iprops.sex.boy || keyA==iprops.sex.girl) && (sex==encodeUrl(iprops.sex.girl) || sex==encodeUrl(iprops.sex.boy) || sex==encodeUrl(iprops.sex.children))) || ((keyA==iprops.sex.unisexchild) && (sex==encodeUrl(iprops.sex.unisexchild))) || (keyA==iprops.sex.women && sex==encodeUrl(iprops.sex.women)) || (keyA==iprops.sex.men && sex==encodeUrl(iprops.sex.men)) || (keyA==iprops.sex.unisexadult && sex==encodeUrl(iprops.sex.unisexadult))){
                    if(valueC.parent && valueC.parent!=''){
                        let valueCpp=valueC.parent.split(',');
                        if(valueCpp.length==1){
                            CategoriesNav[keyB][valueCpp[0]].push(valueC);
                        }else if(valueCpp.length==2){
                            CategoriesNav[keyB][valueCpp[0]][valueCpp[1]].push(valueC);
                        }else if(valueCpp.length==3){
                            CategoriesNav[keyB][valueCpp[0]][valueCpp[1]][valueCpp[2]].push(valueC);
                        }else if(valueCpp.length==4){
                            CategoriesNav[keyB][valueCpp[0]][valueCpp[1]][valueCpp[2]][valueCpp[3]].push(valueC);
                        }else if(valueCpp.length==5){
                            CategoriesNav[keyB][valueCpp[0]][valueCpp[1]][valueCpp[2]][valueCpp[3]][valueCpp[4]].push(valueC);
                        }
                    }else{
                        CategoriesNav[keyB].push(valueC);                       
                    }
                    }
                    }
                }
            }
        }
        console.log(Value,'Value')
        // console.log(CategoriesNav);
        let keyNum=0;
        let products=Object.values(this.state.filterdProducts).map(function(value,key){
        let is_hidden='';
        let somayenaro=false;
        let brandname='';
        if(sex){
            // if(value.sex==decodeUrl(sex)){somayenaro=false;}else{somayenaro=true;}
            // if(somayenaro && (sex=='مردانه' || sex=='زنانه') && value.sex=='فارغ از جنسیت بزرگسالان'){somayenaro=false;}
            // if(somayenaro && (sex=='کودکانه' || sex=='پسرانه' || sex=='دخترانه') && value.sex=='فارغ از جنسیت کودکان'){somayenaro=false;}
        }
        if(self.state.designer && self.state.designer!=''){
            if(!self.state.designer.includes(value.designer) && !self.state.designer.includes('all')){somayenaro=true;is_hidden='hidden';}else{is_hidden=''}
        }
        if(self.props.designers){
            self.props.designers.forEach(function(item,i){
                if(value.designer==item.id){
                    brandname=item.brand;
                }
            });
        }
        if(!somayenaro){
            if(self.state.catparent!=''){
                let catparent=self.state.catparent.split(',');
                let productparent=value.catparent.split(',');
                catparent.forEach(function(catparentitem,catparenti){
                    if(catparent[catparenti]!=productparent[catparenti]){somayenaro=true;}
                });
            }
            if(value.price < self.state.price.min || value.price > self.state.price.max){somayenaro=true;}
        }
        let producturl=value.title;
        let productprice=value.price;
        let customsew=false;
        if(value.customsew!='' && value.customsew!=null){
            JSON.parse(value.customsew).forEach(function(item,i){
                if(i==1){customsew=true;}
            });
        }
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
        if(self.state.onlydiscount && !coupon){somayenaro=true;}
        if(tag_init && !somayenaro){
            somayenaro=true;
            if(value.tag && Array.from(value.tag.split(','),Number).includes(tag_id)){ somayenaro=false; }
        }
        if(!somayenaro){
        keyNum+=1;
        const goldenkey=value.pid+'-'+value.id
        return(
        <Link href={`/product-${value.pid}/${encodeURIComponent(encodeUrl(producturl))}#${encodeUrl(value.colorurl)}`} key={`product-${key}`}><a onClick={self.goProduct.bind(this)} data-key={goldenkey} className={`iproduct-${goldenkey} catpreviewitem squareitem animated fadeIn ${is_hidden}`}>
            <div className="squarecontent">
            <div className="catpreviewimg animated fadeIn delay-1s"><img alt={value.title+' '+value.colortitle} src={value.img}/>{coupon ? (<span className="catpreviewcoupon">% {self.toEnglishDigits(couponpercent.toString())}</span>) : ('')}</div>
            <div className="catpreviewitembar">
                <h5>{brandname}</h5>
                <div className="catpreviewcat" data-for={`enrich`} data-tip={value.title+' '+value.colortitle}>{self.substrBytes(value.title,0,30)==value.title ? (value.title) : (self.substrBytes(value.title,0,30)+'...')}</div>
                {value.count<=0 ? (<>{customsew ? (<div className="catpreviewprice"><span>{iprops.custommade}</span></div>) : (<div className="catpreviewprice"><span>{iprops.unavailable}</span></div>)}</>) : (<div className="catpreviewprice"><span>{self.mulababy(value.price)}</span>{coupon ? (<span>{self.mulababy(productprice)}</span>) : ('')}</div>)}
            </div>
            </div>
        </a></Link>
        );
        }
        // if(console.log(keyNum+'>>>'))
        });
        if(this.state.filterdProducts.length==0 || keyNum==0){
            if(!this.state.loading){
            products=(<div key="zeropr" className="catpreviewitem squareitem animated fadeIn squarenotfound">
                <div className="squarecontent">
                    <div className="squareTitle">{iprops.noproductsfound}!</div>
                </div>
            </div>);
            }else{
            products=(<div key="zeropr2" className="catpreviewitem squareitem animated fadeIn squarenotfound">
                <div className="squarecontent">
                    <div className="squareTitle squareInLoad">{iprops.processing}</div>
                </div>
            </div>);
            }
        }else{
            if(this.state.paginationloading){
            products.push(<div key="zeropr3" className="catpreviewitem squareitem animated fadeIn squarenotfound">
                <div className="squarecontent">
                    <div className="squareTitle squareInLoad">{iprops.processing}</div>
                </div>
            </div>);
            }
            products.push(<ReactTooltip key={`reacttooltip0`} backgroundColor="#a1b7a1f0" textColor="#222" id={`enrich`}/>);
        }
        const filterParent=(<a>hello world</a>);
        const totalresults=this.state.totalresults!=0 ? <span>{this.props.locale=='fa' || this.props.locale=='ar' ? this.numberWithCommas(this.state.totalresults) : this.state.totalresults} {iprops.result}</span> : '';
        let notNav=(<div className="whereami animated fadeIn">{totalresults}<div className={`openFilter${this.state.minimizeFilter ? (' active animated fadeIn') : ('')}`} onClick={this.maximizeFilter}>فیلتر</div>{sex ? <a></a> : ''}<a onClick={tag_init ? self.tagcloser : ()=>false } className="noselect">تمامی محصولات{this.state.onlydiscount ? ' تخفیف‌دار' : ''}</a>{tag_init ? tag_init : ''}<a></a></div>);
        if(term){notNav=(<div className="whereami animated fadeIn">{totalresults}<b className="noselect active">{iprops.searchfor} "{decodeUrl(term)}"</b>{tag_init ? tag_init : ''}<a></a></div>);}
        // {term ? (<div className="whereami animated fadeIn"><a className="noselect">جدیدترین محصولات</a><a></a></div>) : ('i')}
        
        // (<div className="whereami animated fadeIn"><a className="noselect">جدیدترین محصولات</a><a></a></div>) : (<div className="whereami animated fadeIn"><a className="noselect">جدیدترین محصولات</a><a></a></div>)} ;
        // const filterParent=()=>{(<a>hello</a>)
        //     // let result=[];
        //     // let key=0;
        //     // let res,ult,keyE;
        //     // let encodeUrl=(str)=>{return str.replace(/ /g,'-')}
        //     // let decodeUrl=(str)=>{return str.replace(/-/g, ' ')}
        //     // for (const [keyA, valueA] of Object.entries(self.props.navList)) {
        //     // // console.log(keyA);
        //     // for (const [keyB, valueB] of Object.entries(valueA)) {}}
        // }

        let currentUrl=this.props.router.asPath;
        currentUrl=decodeURI(currentUrl.split("?")[0].split("#")[0]);
        let Ttitle=this.state.title;
        let Tdescription='';
        if(false && window.configDescriptions){
            window.configDescriptions.map(function(configitem){
                if(currentUrl==configitem.url){
                    if(configitem.title!=''){Ttitle=configitem.title;}
                    if(configitem.description!=''){Tdescription=configitem.description;}
                }
            });
        }

        let quer = null;
        quer = this.currQuery();
        console.log(quer,'search')
        // delete quer.slug;
        // let _products = products;
        // if(Array.isArray(products)){
        //     _products = products.slice(self.state.offset, self.state.offset + self.state.perPage)
        // }
        // const countPage = Math.ceil(products.length / self.state.perPage);
        return (
               <div className="categories">
                    <div className={`filterside noselect${this.state.minimizeFilter ? (' minimize') : ('')}`}>
                    <div className="filterheader">{iprops.filterby}<div className="minimizefilter noselect" onClick={this.minimizeFilter}>×</div></div>
                   <div className="filterbox filterbox-sex">
                       <div className="filterhead"><h5>{iprops.gender}</h5><div className="toggleFilter"></div></div>
                       <form name="filterCategoryArea" className="filterbody">
                            {/* {!title ? (<React.Fragment>
                            {nav=='همه' ? (<React.Fragment>
                                                        </React.Fragment>) : (<React.Fragment><label className="filterinput">همه<input type="checkbox" name="filterSex[]" value="all" defaultChecked onChange={this.filterSex.bind(this)}/><span className="checkmark"></span></label>
                            <label className="filterinput">مردان<input type="checkbox" name="filterSex[]" value="مردانه" onChange={this.filterSex.bind(this)}/><span className="checkmark"></span></label>
                            <label className="filterinput">زنان<input type="checkbox" name="filterSex[]" value="زنانه" onChange={this.filterSex.bind(this)}/><span className="checkmark"></span></label>
                            <label className="filterinput">پسران<input type="checkbox" name="filterSex[]" value="پسرانه" onChange={this.filterSex.bind(this)}/><span className="checkmark"></span></label>
                            <label className="filterinput">دختران<input type="checkbox" name="filterSex[]" value="دخترانه" onChange={this.filterSex.bind(this)}/><span className="checkmark"></span></label>
                            <label className="filterinput">فارغ از جنسیت<input type="checkbox" name="filterSex[]" value="فارغ از جنسیت" onChange={this.filterSex.bind(this)}/><span className="checkmark"></span></label>
                            </React.Fragment>)}
                            </React.Fragment>) : (<React.Fragment>
                            <Link to={encodeUrl(`/categories/${nav}${parent ? ('/'+parent) : ('')}${title ? ('/'+title) : ('')}`)} className="filterinput">همه<input type="checkbox" name="filterSex[]" checked={!sex} readOnly/><span className="checkmark"></span></Link>
                            <Link to={encodeUrl(`/categories/${nav}${parent ? ('/'+parent) : ('')}${title ? ('/'+title) : ('')}/مردانه`)} className="filterinput">مردان<input type="checkbox" name="filterSex[]" checked={sex=='مردانه'} readOnly/><span className="checkmark"></span></Link>
                            <Link to={encodeUrl(`/categories/${nav}${parent ? ('/'+parent) : ('')}${title ? ('/'+title) : ('')}/زنانه`)} className="filterinput">زنان<input type="checkbox" name="filterSex[]" checked={sex=='زنانه'} readOnly/><span className="checkmark"></span></Link>
                            <Link to={encodeUrl(`/categories/${nav}${parent ? ('/'+parent) : ('')}${title ? ('/'+title) : ('')}/پسرانه`)} className="filterinput">پسران<input type="checkbox" name="filterSex[]" checked={sex=='پسرانه'} readOnly/><span className="checkmark"></span></Link>
                            <Link to={encodeUrl(`/categories/${nav}${parent ? ('/'+parent) : ('')}${title ? ('/'+title) : ('')}/دخترانه`)} className="filterinput">دختران<input type="checkbox" name="filterSex[]" checked={sex=='دخترانه'} readOnly/><span className="checkmark"></span></Link>
                            <Link to={encodeUrl(`/categories/${nav}${parent ? ('/'+parent) : ('')}${title ? ('/'+title) : ('')}/فارغ-از-جنسیت`)} className="filterinput">فارغ از جنسیت<input type="radio" name="filterSex[]" checked={sex=='فارغ-از-جنسیت' || sex=='مردانه' || sex=='زنانه'} readOnly/><span className="checkmark"></span></Link>
                            </React.Fragment>)} */}
                            <Link href={{ pathname: encodeUrl(`/categories/${iprops.sex.women}${nav ? '/'+nav : ('')}`), query: quer }}><a className="filterinput">{iprops.sex.women}<input type="checkbox" name="filterSex[]" checked={sex==encodeUrl(iprops.sex.women)} readOnly/><span className="checkmark"></span></a></Link>
                            <Link href={{ pathname: encodeUrl(`/categories/${iprops.sex.men}${nav ? '/'+nav : ('')}`), query: quer }}><a className="filterinput">{iprops.sex.men}<input type="checkbox" name="filterSex[]" checked={sex==encodeUrl(iprops.sex.men)} readOnly/><span className="checkmark"></span></a></Link>
                            <Link href={{ pathname: encodeUrl(`/categories/${iprops.sex.unisexadult}${nav ? '/'+nav : ('')}`), query: quer }}><a className="filterinput">{iprops.sex.unisexadult}<input type="checkbox" name="filterSex[]" checked={sex==encodeUrl(iprops.sex.unisexadult)} readOnly/><span className="checkmark"></span></a></Link>
                            <Link href={{ pathname: encodeUrl(`/categories/${iprops.sex.unisexchild}${nav ? '/'+nav : ('')}`), query: quer }}><a className="filterinput">{iprops.sex.unisexchild}<input type="checkbox" name="filterSex[]" checked={sex==encodeUrl(iprops.sex.unisexchild) || sex==encodeUrl(iprops.sex.children)} readOnly/><span className="checkmark"></span></a></Link>
                            <Link href={{ pathname: encodeUrl(`/categories/${iprops.sex.boy}${nav ? '/'+nav : ('')}`), query: quer }}><a className="filterinput">{iprops.sex.boy}<input type="checkbox" name="filterSex[]" checked={sex==encodeUrl(iprops.sex.boy) || sex==encodeUrl(iprops.sex.children)} readOnly/><span className="checkmark"></span></a></Link>
                            <Link href={{ pathname: encodeUrl(`/categories/${iprops.sex.girl}${nav ? '/'+nav : ('')}`), query: quer }}><a className="filterinput">{iprops.sex.girl}<input type="checkbox" name="filterSex[]" checked={sex==encodeUrl(iprops.sex.girl) || sex==encodeUrl(iprops.sex.children)} readOnly/><span className="checkmark"></span></a></Link>
                       </form>
                   </div>
                   {!term ? <div className="filterbox filterbox-categories">
                       <div className="filterhead"><h5>{iprops.categories}</h5><div className="toggleFilter"></div></div>
                       <form name="filterCategoryArea" className="filterbody catjedaar">
                       {sex ? Object.entries(Object.assign({},CategoriesNav)).map(function(valueA,i){
                            return (<div key={`filtercat0${i}`} className={`catje ${nav==encodeUrl(valueA[0]) ? ('active') : ('')}`}><Link href={{ pathname: `/categories/${sex}/${nav==encodeUrl(valueA[0]) ? encodeUrl(valueA[0]) : encodeUrl(valueA[0])}`, query: quer }}><a className="catjetitle">{valueA[0]}</a></Link><div className="catjechilds">
                                {valueA[1] && Object.entries(valueA[1]).map(function(valueB,i){
                                    if(Array.isArray(valueB[1])){
                                        return (<div key={`filtercat00${i}`} className="catje"><div className={`catjetitle${Object.entries(valueB[1]).length==0 ? (' catjeislonely') : ('')}`} data-parent={`${valueB[0]}`} onClick={self.Catje.bind(this)}>{valueB[0]}</div><div className="catjechilds">
                                        {valueB[1] && Object.entries(valueB[1]).map(function(valueC,i){
                                            if(Array.isArray(valueC[1])){
                                            return (<div key={`filtercat000${i}`} className="catje"><div className={`catjetitle${Object.entries(valueC[1]).length==0 ? (' catjeislonely') : ('')}`} data-parent={`${valueB[0]},${valueC[0]}`} onClick={self.Catje.bind(this)}>{valueC[0]}</div><div className="catjechilds">
                                                {valueC[1] && Object.entries(valueC[1]).map(function(valueD,i){
                                                    if(Array.isArray(valueD[1])){
                                                    return (<div key={`filtercat0000${i}`} className="catje"><div className={`catjetitle${Object.entries(valueD[1]).length==0 ? (' catjeislonely') : ('')}`} data-parent={`${valueB[0]},${valueC[0]},${valueD[0]}`} onClick={self.Catje.bind(this)}>{valueD[0]}</div><div className="catjechilds">
                                                        {valueD[1] && Object.entries(valueD[1]).map(function(valueE,i){
                                                            if(Array.isArray(valueE[1])){
                                                            return (<div key={`filtercat0000${i}`} className="catje"><div className={`catjetitle${Object.entries(valueE[1]).length==0 ? (' catjeislonely') : ('')}`} data-parent={`${valueB[0]},${valueC[0]},${valueD[0]},${valueE[0]}`} onClick={self.Catje.bind(this)}>{valueE[0]}</div><div className="catjechilds">
                                                                {valueE[1] && Object.entries(valueE[1]).map(function(valueF,i){
                                                                    if(Array.isArray(valueF[1])){
                                                                    return (<div key={`filtercat00000${i}`} className="catje"><div className={`catjetitle${Object.entries(valueF[1]).length==0 ? (' catjeislonely') : ('')}`} data-parent={`${valueB[0]},${valueC[0]},${valueD[0]},${valueE[0]},${valueF[0]}`} onClick={self.Catje.bind(this)}>{valueF[0]}</div><div className="catjechilds">
                                                                        {valueF[1] && Object.entries(valueF[1]).map(function(valueG,i){
                                                                        if(Array.isArray(valueG[1])){
                                                                        return (<div key={`filtercat0000000${i}`} className="catje"><div className={`catjetitle${Object.entries(valueG[1]).length==0 ? (' catjeislonely') : ('')}`} data-parent={`${valueB[0]},${valueC[0]},${valueD[0]},${valueE[0]},${valueF[0]},${valueG[0]}`} onClick={self.Catje.bind(this)}>{valueG[0]}</div><div className="catjechilds">
                                                                        </div></div>);
                                                                        }else{ return (<div key={`filtercat0000000${i}`} className={`catje${title==encodeUrl(valueG[1].title) ? (' superactive') : ('')}`}><Link href={{ pathname: `/categories/${encodeUrl(valueG[1].sex)}/${encodeUrl(valueA[0])}/${encodeUrl(valueG[1].title)}`, query: quer }}><a className="catjetitle catjeislonely">{valueG[1].title}</a></Link></div>);}
                                                                        })}
                                                                    </div></div>);
                                                                    }else{ return (<div key={`filtercat000000${i}`} className={`catje${title==encodeUrl(valueF[1].title) ? (' superactive') : ('')}`}><Link href={{ pathname: `/categories/${encodeUrl(valueF[1].sex)}/${encodeUrl(valueA[0])}/${encodeUrl(valueF[1].title)}`, query: quer }}><a className="catjetitle catjeislonely">{valueF[1].title}</a></Link></div>);}
                                                                })}
                                                            </div></div>);
                                                            }else{ return (<div key={`filtercat00000${i}`} className={`catje${title==encodeUrl(valueE[1].title) ? (' superactive') : ('')}`}><Link href={{ pathname: `/categories/${encodeUrl(valueE[1].sex)}/${encodeUrl(valueA[0])}/${encodeUrl(valueE[1].title)}`, query: quer }}><a className="catjetitle catjeislonely">{valueE[1].title}</a></Link></div>);}
                                                        })}
                                                    </div></div>);
                                                    }else{ return (<div key={`filtercat0000${i}`} className={`catje${title==encodeUrl(valueD[1].title) ? (' superactive') : ('')}`}><Link href={{ pathname: `/categories/${encodeUrl(valueD[1].sex)}/${encodeUrl(valueA[0])}/${encodeUrl(valueD[1].title)}`, query: quer }}><a className="catjetitle catjeislonely">{valueD[1].title}</a></Link></div>);}
                                                })}
                                            </div></div>);
                                            }else{ return (<div key={`filtercat000${i}`} className={`catje${title==encodeUrl(valueC[1].title) ? (' superactive') : ('')}`}><Link href={{ pathname: `/categories/${encodeUrl(valueC[1].sex)}/${encodeUrl(valueA[0])}/${encodeUrl(valueC[1].title)}`, query: quer }}><a className="catjetitle catjeislonely">{valueC[1].title}</a></Link></div>);}
                                        })}
                                    </div></div>);
                                    }else{ return (<div key={`filtercat00${i}`} className={`catje${title==encodeUrl(valueB[1].title) ? (' superactive') : ('')}`}><Link href={{ pathname: `/categories/${encodeUrl(valueB[1].sex)}/${encodeUrl(valueA[0])}/${encodeUrl(valueB[1].title)}`, query: quer }}><a className="catjetitle catjeislonely">{valueB[1].title}</a></Link></div>);}
                                })}
                                {/* <div className="catje"><Link to={`/categories/${sex}/${encodeUrl(valueA[0])}${title ? encodeUrl('/'+title) : ('')}`} key={`filtercat${i}`} className="catjetitle">{valueA[0]}</Link></div> */}
                                {/* <div className="catje"><Link to={`/categories/${sex}/${encodeUrl(valueA[0])}${title ? encodeUrl('/'+title) : ('')}`} key={`filtercat${i}`} className="catjetitle">{valueA[0]}</Link></div> */}
                                {/* <div className="catje"><Link to={`/categories/${sex}/${encodeUrl(valueA[0])}${title ? encodeUrl('/'+title) : ('')}`} key={`filtercat${i}`} className="catjetitle">{valueA[0]}</Link></div> */}
                            </div></div>)
                        }) : (`${iprops.processing}...`)} 
                       </form>
                   </div> : ''} 
                    {/* {nav &&
                   <div className="filterbox">
                       <div className="filterhead"><h5>انواع</h5><div className="toggleFilter"></div></div>
                       <form name="filterCategoryArea" className="filterbody">
                        <Link to={`/categories/${sex}/${encodeUrl(nav)}`} key={`filtercat0`} className="filterinput">همه<input type="radio" onChange={self.filterCat.bind(this)} name="filterCategory" {...(!title ? {checked: true} : {}) }/><span className="checkmark"></span></Link>
                       {this.props.navList ? Object.entries(Object.assign({},CategoriesTitle)).map(function(valueA,i){
                            return (<Link to={`/categories/${sex}/${nav}/${encodeUrl(valueA[0])}`} key={`filtercat${i}`} className="filterinput">{valueA[0]}<input type="radio" onChange={self.filterCat.bind(this)} name="filterCategory" {...(encodeUrl(valueA[0])==title ? {checked: true} : {}) }/><span className="checkmark"></span></Link>);
                        }) : ('در حال پردازش...')} 
                       </form>
                   </div>
                    } */}
                   <article className="filterbox filterbox-price">
                       <div className="filterhead"><h5>{iprops.pricerange}</h5><div className="toggleFilter"></div></div>
                        <form name="filterPriceArea" className="filterbody">
                        <div className="filterPriceAreaInputs">
                        <label>{iprops.from}<input type="text" maxLength={8} data-rel="min" className="filterPriceAreaInputMin" onChange={this.filterPriceInput.bind(this)} defaultValue={this.mulababy(this.state.price.min,true)}/>{this.mulababy(this.state.preprice.min)}</label>
                        <label>{iprops.upto}<input type="text" maxLength={8} data-rel="max" className="filterPriceAreaInputMax" onChange={this.filterPriceInput.bind(this)} defaultValue={this.mulababy(this.state.price.max,true)}/>{this.mulababy(this.state.preprice.max)}</label>
                        <div className={`btn${self.deepEqual(self.state.preprice,self.state.price) ? ' disabled' : ''}`} style={{textAlign:'center',marginTop:'10px',padding:'10px'}} onClick={this.setFilterPrice}>{iprops.applypricefilter}</div>
                        </div>
                            {/* <label className="filterinput">{iprops.all}
                            <input type="checkbox" name="filterDesigner[]" value="all" checked={!self.state.designer} onChange={this.filterDesigner.bind(this)} />
                            <span className="checkmark"></span>
                            </label> */}
                        </form>
                   </article>
                   <div className="filterbox filterbox-designers">
                       <div className="filterhead"><h5>{iprops.designers}</h5><div className="toggleFilter"></div></div>
                       <form name="filterCategoryArea" className="filterbody">
                        <label className="filterinput">{iprops.all}
                        <input type="checkbox" name="filterDesigner[]" value="all" checked={!self.state.designer} onChange={this.filterDesigner.bind(this)} />
                        <span className="checkmark"></span>
                        </label>
                        {this.props.designers ? Object.values(this.props.designers).map(function(item,i){
                            let desidefu=false;
                            if(self.state.designer){
                                if(self.state.designer.includes(item.id.toString())){desidefu=true}else{desidefu=false}
                            }
                            return (<label key={`filterdesigners${i}`} className="filterinput">{item.name}<input type="checkbox" checked={desidefu} onChange={self.filterDesigner.bind(this)} name="filterDesigner[]" value={item.id}/><span className="checkmark"></span></label>);
                        }) : (`${iprops.processing}...`)}
                       </form>
                   </div>
                    <div className="filterbox filterbox-discount">
                    <div className="filtercheckbox" onClick={self.onlydiscount}>
                        <input type="checkbox" name="onlydiscount" checked={self.state.onlydiscount} readOnly value="true"/><span className="checkmark"></span><h5>{iprops.onlydiscountproducts}</h5>
                    </div>
                    </div>
                    <div className="filterboxcloser" onClick={this.minimizeFilter}>{iprops.applyfilters}</div>
                   </div>
                    <div className={`productside${this.state.minimizeFilter ? (' minimize') : ('')}`}>
                        
                            {sex ? (
                                <div className="whereami">

                                <section className="productSorter" onClick={this.productSorter.bind(this)}>
                                    <div className="catpreviewfilterbox">
                                        <a className={self.state.sort=='most-popular' ? 'active' : null} onClick={()=>self.sortSystem('most-popular')}>{iprops.sortByHit}</a>
                                        <a onClick={()=>self.sortSystem('the-newest')} className={self.state.sort=='the-newest' ? 'active' : null}>{iprops.sortByNewest}</a>
                                        <a onClick={()=>self.sortSystem('highest-price')} className={self.state.sort=='highest-price' ? 'active' : null}>{iprops.sortByValuable}</a>
                                        <a onClick={()=>self.sortSystem('lowest-price')} className={self.state.sort=='lowest-price' ? 'active' : null}>{iprops.sortByCutrate}</a>
                                    </div>
                                </section>

                                    {totalresults}

                                <div className={`openFilter${this.state.minimizeFilter ? (' active animated fadeIn') : ('')}`} onClick={this.maximizeFilter}>{iprops.filter}</div>
                                {sex ? (<Link href={{ pathname: toSex, query: quer }}><a>{decodeUrl(sex)}{this.state.onlydiscount && !nav && !title ? ' '+iprops.discounted : ''}</a></Link>) : ('')}
                                {nav ? (<Link href={{ pathname: toNav, query: quer }}><a>{decodeUrl(nav)}{this.state.onlydiscount && !title ? ' '+iprops.discounted : ''}</a></Link>) : ('')}
                                {/* {parent ? (<Link to={toParent}>{decodeUrl(parent)}</Link>) : ('')} */}
                                {title ? (<Link href={{ pathname: toTitle, query: quer }}><a>{decodeUrl(title)}{this.state.onlydiscount ? ' '+iprops.discounted : ''}</a></Link>) : ('')}
                                {tag_init ? tag_init : ''}
                                </div>
                            ) : notNav }

                    <div className="catpreviewbar animated fadeIn slow"><div className={`catpreviewfilter${this.state.queryloading ? ' catpreviewfilter-inload' : ''}`}><span>{iprops.orderby} : </span><div className="catpreviewfilterbox"><a className={self.state.sort=='most-popular' ? 'active' : null} onClick={()=>self.sortSystem('most-popular')}>{iprops.sortByHit}</a><a onClick={()=>self.sortSystem('the-newest')} className={self.state.sort=='the-newest' ? 'active' : null}>{iprops.sortByNewest}</a><a onClick={()=>self.sortSystem('highest-price')} className={self.state.sort=='highest-price' ? 'active' : null}>{iprops.sortByValuable}</a><a onClick={()=>self.sortSystem('lowest-price')} className={self.state.sort=='lowest-price' ? 'active' : null}>{iprops.sortByCutrate}</a></div></div><a className="catpreviewbarmore" onClick={this.goBack.bind(this)}><span>{iprops.back}</span></a></div>
                    <div className="catpreview animated fadeIn delay-1s">
                    {/* {_products} */}
                    {products}
                    </div>

                    {/* {countPage>1 ? (<ReactPaginate
                    previousLabel={"صفحه قبل"}
                    nextLabel={"صفحه بعد"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={countPage}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    initialPage={self.state.currentPage}
                    onPageChange={self.paginationHandle}
                    containerClassName={"megapagination noselect"}
                    subContainerClassName={"pages megapagination"}
                    activeClassName={"active"}/>) : ''} */}

                    </div>
               </div>
        );
    }
})