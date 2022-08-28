import React, { Component } from 'react';
import Link from 'next/link';
import $ from 'jquery';
// import OwlCarousel from 'react-owl-carousel2';
import {postData} from './postData';
import Headere from './Headere';
import translate from '@/config/translate';
// const owlOfferproducts={
//     responsive:{
//         1000:{items:1},
//         600:{items:2},
//         0:{items:1}
//     },
//     loop:true,
//     dots:false,
//     nav:true,
//     rtl:true,
//     autoplayTimeout:2500,
//     autoplay:true,
//     autoplayHoverPause:true
// };
// const owlCatpreview={
//     responsive:{
// 		1200:{items:3},
//         450:{items:2},
//         0:{items:1}
// 	},
// 	items:3,
// 	dots:false,
// 	nav:true,
//     rtl:true,
// 	autoplayTimeout:2500,
// 	autoplay:true,
// 	autoplayHoverPause:true
// };
// class Catpreview extends Component{
// constructor(props){
//     super(props);
//     this.state={loading:true,products:[],sortActive:false}
//     this.sortActive = this.sortActive.bind(this);
//     this.sortByValuable = this.sortByValuable.bind(this);
//     this.sortByCutrate = this.sortByCutrate.bind(this);
//     this.sortByHit = this.sortByHit.bind(this);
//     this.sortByNewest = this.sortByNewest.bind(this);
// }
// componentDidMount(){
//     //console.log('>'+this.props.cat);
//     $(document).ready(resized);
//     $(window).resize(resized);
//     function resized(){
//         $(".owl-carousel").trigger('refresh.owl.carousel');
//     }
//     $('body').addClass('cowlcarousel');
// }

// UNSAFE_componentWillReceiveProps(nextProps){
//     console.log(nextProps);
//     let self=this;
//     let uniqKEY=0;
//     let pproducts=[];
//     let products=[];
//     let pussy=nextProps.cat;
//     pussy = pussy.replace(/-/g, ' ');
//     for (const [keyB, valueB] of Object.entries(nextProps.products)) {
//         if(keyB==pussy){
//             valueB.forEach(function(fatheritem,fatherindex){
//                 fatheritem.colors.forEach(function(item,index){
//                     products[uniqKEY]=[];
//                     products[uniqKEY].brand=fatheritem.brand;
//                     let itemImg=item.img.split(',');
//                     if(item.thumbnail==''){products[uniqKEY].img=itemImg[0];}else{products[uniqKEY].img=item.thumbnail;}
//                     products[uniqKEY].title=fatheritem.title;
//                     products[uniqKEY].colortitle=item.title;
//                     products[uniqKEY].colorurl=item.url;
//                     products[uniqKEY].id=uniqKEY;
//                     products[uniqKEY].sales=item.sales;
//                     products[uniqKEY].pid=fatheritem.id;
//                     products[uniqKEY].price=item.price;
//                     uniqKEY++;
//                 });  
//             });
            
//         pproducts=valueB;
//         }
//     }
//     // console.log(products);
//     this.setState({products:products});
// }
// toEnglishDigits(str){var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];return str.replace(/[0-9]/g, function (w) {return id[+w];});}
// numberWithCommas(x){return this.toEnglishDigits(x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));}
// sortByValuable(){
//     const {products} = this.state;
//     let newProdList = products.reverse();
//     this.setState({products:newProdList.sort((a,b)=>b.price - a.price)});
// }
// sortByCutrate(){
//     const {products} = this.state;
//     let newProdList = products.reverse();
//     this.setState({products:newProdList.sort((a,b)=>a.price - b.price)});
// }
// sortByHit(){
//     const {products} = this.state;
//     let newProdList = products.reverse();
//     this.setState({products:newProdList.sort((a,b)=>b.sales - a.sales)});
// }
// sortByNewest(){
//     const {products} = this.state;
//     let newProdList = products.reverse();
//     this.setState({products:newProdList.sort((a,b)=>b.id - a.id)});
// }
// sortActive(){
//     if(this.state.sortActive){
//         this.setState({'sortActive':false});
//     }else{
//         this.setState({'sortActive':true});
//     }
// }
// render(){
//     let self=this;
//     let pussy=this.props.cat;
//     pussy = pussy.replace(/-/g, ' ');
//     let cptitle = pussy;
//     let cpid;
//     let products;
//     let encodeUrl=(str)=>{return str.replace(/ /g,'-')}
//     let decodeUrl=(str)=>{return str.replace(/-/g, ' ')}
//     if(this.state.products){
//         products=Object.values(this.state.products).map(function(value,key){
//         return(<Link href={`/product-${value.pid}/${encodeUrl(value.title)}#${encodeUrl(value.colorurl)}`} key={key}><a style={{'animationDelay':(key/5)+'s'}} className="noselect catpreviewitem animated slideInUp">
//         <div className="catpreviewimg animated fadeIn delay-1s"><img alt={value.title+' '+value.colortitle} title={value.title+' '+value.colortitle} src={value.img}/><img alt={value.title} src={value.img} draggable="false"/></div>
//         <div className="catpreviewitembar">
//             <h5>{value.brand}</h5>
//             <div className="catpreviewcat">{value.title}</div>
//             <div className="catpreviewprice">
//             <span>{self.numberWithCommas(value.price)} تومان</span>
//             </div>
//         </div>
//     </a></Link>);key+=1;
//     });
//     if(this.state.products.length==0){
//         products=(<div className="catpreviewitem squareitem squareitemnoafter animated fadeIn squarenotfound">
//             <div className="squarecontent">
//                 <div className="squareTitle">محصولی یافت نشد!</div>
//             </div>
//         </div>);
//     }
//     }
//     if(this.props.products.length==0){
//         products=(<div className="catpreviewitem squareitem squareitemnoafter animated fadeIn squarenotfound">
//             <div className="squarecontent">
//                 <div className="squareTitle">در حال پردازش...</div>
//             </div>
//         </div>);
//     }
//     return (
//         <div className="catpreview">
//         <div className="catpreviewsubject">
//         <h5>{cptitle}</h5>
//         <img alt="cptitle" src={`/img/${encodeUrl(cptitle)}.jpg`}/>
//         </div>
//         <div className="catpreviewstage">
//         <div className="catpreviewbar">
//         <div className={`catpreviewfilter${this.state.sortActive ? (' active') : ('')}`}>
//         <span>فیلتر بر اساس:</span>
//         <div onClick={this.sortActive} className={`catpreviewfilterbox`}>
//         <a onClick={this.sortByNewest} className="active">جدیدترین محصولات</a>
//         <a onClick={this.sortByHit}>پر فروش ترین</a>
//         <a onClick={this.sortByValuable}>گران ترین</a>
//         <a onClick={this.sortByCutrate}>ارزان ترین</a>
//         </div>
//         </div>
//         <Link href={`/categories/${encodeUrl(cptitle)}`}><a className="catpreviewbarmore">مشاهده همه محصولات</a></Link>
//         </div>
//         <div className="catpreviewowl">
//         <OwlCarousel className="owl-catpreview owl-carousel" options={owlCatpreview}>
//         {products}
//         </OwlCarousel>
//         </div>
//         </div>
//         </div>
//     )
// }
// }

/*
class LastVivi extends Component(){
    // constructor(props){
    //     super(props);
    //     this.state={products:this.props.products}
    // }
    render(){
        // if(this.state.products.count!=0){
            return (<section className="categories">
            <div className="container-cafca">
            <div className="titlebar">آخرین بازدید ها</div>
            <div className="lgproducts">
            helloo
            </div>
            </div>
            </section>)
        // }
    }
}
*/


export default class Home extends Component {
    constructor(props){
        super(props);
        this.state={products:[],lastvisites:[],loading:true,designers:[]}
        this.getProducts = this.getProducts.bind(this);
        this.getDesigners = this.getDesigners.bind(this);
    }
    componentDidMount(){
        // this.getProducts();
        this.getLastVisits();
        this.getDesigners();
        const winWeed=$(window).width();
        // if (winWeed <= 1000){$('body .headerCenter').insertAfter('.navCat');}
        $('body').addClass('wellcome');
        // $(document).mousemove(function(event){
        //     const pos = event.pageX;
        //     //$('.headerCenter .background').css({'background-position':(100-(pos/100)) + '%'});
        // });
        
    }
    // UNSAFE_componentWillReceiveProps(nextProps){
    //     this.getDesigners();
    // }
    getDesigners(){
        this.setState({ designers: this.props.designers });
    }
    getProducts(){
        axios.post('/:api:products:home').then(response=>{
            this.setState({products:response.data},()=>this.setState({'loading':false}));
        }).catch(errors=>{console.log(errors);});
    }
    getLastVisits(){
        let localUserData=localStorage['userData'];
        if(localUserData){
        let updateData={userphone:JSON.parse(localUserData).userphone}
        // postData('getlastvisits',updateData).then((result)=>{this.setState({lastvisites:result.products})});
        // alert(this.state);
        }
    }
    // componentWillUnmount(){
    //     const winWeed=$(window).width();
    //     if(winWeed <= 1000){$('body .headerCenter').insertAfter('.headerRight');}
    // }
    render() {
            // if(this.state.filterdProduts.length==0){
            //     if(!this.state.loading){
            //     products=(<div className="catpreviewitem squareitem animated fadeIn squarenotfound">
            //         <div className="squarecontent">
            //             <div className="squareTitle">محصولی یافت نشد!</div>
            //         </div>
            //     </div>);
            //     }else{
            //     products=(<div className="catpreviewitem squareitem animated fadeIn squarenotfound">
            //         <div className="squarecontent">
            //             <div className="squareTitle">در حال پردازش...</div>
            //         </div>
            //     </div>);
            //     }
            // }
        let self=this;
        let designersPlay=[];
        if(this.state.designers){
            designersPlay=Object.values(this.state.designers).map(function(value,key){
            return(
            <Link href={`/@${value.url}`} key={`des-${key}`}><a className={`tinydesigner animated fadeIn`} style={{'animationDelay':(key/5)+'s'}}>
            <img alt={value.url} src={value.logo}/>
            </a></Link>
            );
            });
        }
        const iprops = translate[this.props.locale]
        return (
            <React.Fragment>
            <header><Headere locale={this.props.locale} config={this.props.config} /></header>
                {/* <section className="offerline">
                <div className="container-cafca">

                <div className="offerproducts">
                <OwlCarousel ref="car" options={owlOfferproducts}>
                <div className="offerproduct">
                <div className="offerproductimg"><img src="img/product1.png"/></div>
                <div className="offerproductbar">
                    <div className="offerproducttitle">
                    <h5>کتانی ورزشی نایکی - فلای نیت</h5>
                    <div className="offerproductcat">کتانی ورزشی زنانه</div>
                    </div>
                    <div className="offerproductprice">
                    <span>۱،۲۵۰،۰۰۰ تومان</span>
                    <span>۹۵۰،۰۰۰ تومان</span>
                    </div>
                </div>
                </div>
                <div className="offerproduct">
                <div className="offerproductimg"><img src="img/product2.png"/></div>
                <div className="offerproductbar">
                    <div className="offerproducttitle">
                    <h5>کتانی ورزشی نایکی - فلای نیت</h5>
                    <div className="offerproductcat">کتانی ورزشی زنانه</div>
                    </div>
                    <div className="offerproductprice">
                    <span>۱،۲۵۰،۰۰۰ تومان</span>
                    <span>۹۵۰،۰۰۰ تومان</span>
                    </div>
                </div>
                </div>
                <div className="offerproduct">
                <div className="offerproductimg"><img src="img/product3.png"/></div>
                <div className="offerproductbar">
                    <div className="offerproducttitle">
                    <h5>کتانی ورزشی نایکی - فلای نیت</h5>
                    <div className="offerproductcat">کتانی ورزشی زنانه</div>
                    </div>
                    <div className="offerproductprice">
                    <span>۱،۲۵۰،۰۰۰ تومان</span>
                    <span>۹۵۰،۰۰۰ تومان</span>
                    </div>
                </div>
                </div>
                <div className="offerproduct">
                <div className="offerproductimg"><img src="img/product4.png"/></div>
                <div className="offerproductbar">
                    <div className="offerproducttitle">
                    <h5>کتانی ورزشی نایکی - فلای نیت</h5>
                    <div className="offerproductcat">کتانی ورزشی زنانه</div>
                    </div>
                    <div className="offerproductprice">
                    <span>۱،۲۵۰،۰۰۰ تومان</span>
                    <span>۹۵۰،۰۰۰ تومان</span>
                    </div>
                </div>
                </div>
                </OwlCarousel>

                </div>
                <div className="offerbanner noselect"><img src="img/offerBanner.jpg"/><h5>تخفیف ویژه روی جدیدترین محصولات نایکی</h5></div>
                </div>
                </section> */}

                <section className="designersportal">
                <Link href="/designers"><a className="designersportalCenter">{iprops.dizadesigners}</a></Link>
                </section>
                
                {/* <section className="blackbox">
                <h5>{this.props.config && this.props.config.indexDesignersTitle}</h5>
                <Link className="btn-white" to="/designers">مشاهده برند ها</Link>
                </section> */}

                {/* <div className="tinydesigners">{designersPlay}</div> */}

                {/* <section className="catpreviews">
                <div className="container-cafca">
                <div className="titlebar tablethidden">نیم نگاهی به محصولات</div>
                <Catpreview navList={this.props.navList} products={this.state.products} cat="پوشاک"/>
                <Catpreview navList={this.props.navList} products={this.state.products} cat="آرایشی-و-بهداشتی"/>
                </div>
                </section> */}

                {/* <LastVivi products={self.state.lastvisites} /> */}
                {/* <BlogRaw match={[{path:'home'}]} /> */}
            {this.props.locale=='en' ? '' : <section className="trustus">
                <div className="trustusitem">
                    <div className="trustusitemimg"><img alt="trustusitemimg 1" src="img/trustitem1.svg" draggable="false"/></div>
                    <h5>{iprops.trustbox[0]}</h5>
                </div>
                <div className="trustusitem">
                    <div className="trustusitemimg"><img alt="trustusitemimg 2" src="img/trustitem2.svg" draggable="false"/></div>
                    <h5>{iprops.trustbox[1]}</h5>
                </div>
                <div className="trustusitem">
                    <div className="trustusitemimg"><img alt="trustusitemimg 3" src="img/trustitem3.svg" draggable="false"/></div>
                    <h5>{iprops.trustbox[2]}</h5>
                </div>
                <div className="trustusitem">
                    <div className="trustusitemimg"><img alt="trustusitemimg 4" src="img/trustitem4.svg" draggable="false"/></div>
                    <h5>{iprops.trustbox[3]}</h5>
                </div>
                </section>}
            </React.Fragment>
        );
    }
}