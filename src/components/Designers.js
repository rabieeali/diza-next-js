import React, {Component} from 'react';
import Link from 'next/link';
import Router, {withRouter} from 'next/router'
import {postData} from '../lib/postData';
import ReactTooltip from 'react-tooltip';
import translate from '@/config/translate';
import {redirect} from 'next/dist/server/api-utils';


export class Designers extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        $('header,nav').addClass('minimize');
    }

    componentWillUnmount() {
        $('header,nav').removeClass('minimize');
    }

    capitalize(s) {
        return s[0].toUpperCase() + s.slice(1);
    }

    render() {
        let self = this;
        let defaultappend = '';
        if (this.props.config.defaultsort) {
            defaultappend = '?sort=' + this.props.config.defaultsort
        }
        const iprops = translate[this.props.locale]
        return (<React.Fragment>
            <section className="designersportal">
                <Link href="/designers"><a className="designersportalCenter">{iprops.dizadesigners}</a></Link>
            </section>
            <section className="designersportalrow">
                {Object.values(self.props.designers).map(function (value, key) {
                    const nameasli = value['name' + self.capitalize(self.props.locale)]
                    const valuename = nameasli != null ? nameasli : value.name;
                    return (<Link href={`@${value.url}${defaultappend}`} key={`designer-${key}`}><a
                        className="designersportalcol"><img src={value.logo} alt={valuename}
                                                            title={valuename}/></a></Link>)
                })}
                <Link href="/join-us"><a
                    className="designersportalcol designersportalcol-join">{iprops.joindiza}</a></Link>
            </section>
        </React.Fragment>)
    }
}

export default withRouter(class Designer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sql: [],
            title: 'طراح',
            img: '',
            url: '',
            content: '',
            logo: '',
            loading: true,
            rawproducts: [],
            products: [],
            currentpagination: 1,
            sortActive: false,
            sort: '',
            sortset: false
        }
        this.goProduct = this.goProduct.bind(this);
        this.sortActive = this.sortActive.bind(this);
        this.sortByValuable = this.sortByValuable.bind(this);
        this.sortByCutrate = this.sortByCutrate.bind(this);
        this.sortByHit = this.sortByHit.bind(this);
        this.sortByNewest = this.sortByNewest.bind(this);
        this.productSorter = this.productSorter.bind(this);
        this.addQuery = this.addQuery.bind(this);
        this.queryConfig = this.queryConfig.bind(this);
        // this.updater = this.updater.bind(this);
        this.getDesigner = this.getDesigner.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.deepEqual(prevProps.router.query, this.props.router.query)) {
            this.queryConfig();
        }
        if (window.location.pathname != this.state.url) {
            this.getDesigner();
        }
    }

    componentDidMount() {
        this.getDesigner();
    }

    deepEqual(x, y) {
        const ok = Object.keys, tk = this, tx = typeof x, ty = typeof y;
        return x && y && tx === 'object' && tx === ty ? (
            ok(x).length === ok(y).length &&
            ok(x).every(key => tk.deepEqual(x[key], y[key]))
        ) : (x === y);
    }

    getDesigner() {
        const searchParams = new URLSearchParams(this.props.router.query);
        const sort = searchParams.get("sort");
        let self = this;
        let currentPath = window.location.pathname;
        this.setState({url: currentPath});
        $('body').addClass('loading');
        let sql = this.props.sql;
        let sliderimg = sql.slider;
        let products = this.props.products;
        if (products == '') {
            products = false;
            this.setState({products: products, loading: false});
        } else {
            let uniqKEY = 0;
            let newproducts = [];
            Object.values(products).forEach(function (fatheritem, fatherindex) {
                fatheritem.colors.forEach(function (item, index) {
                    newproducts[uniqKEY] = [];
                    let itemImg = item.img.split(',');
                    if (item.thumbnail == '') {
                        newproducts[uniqKEY].img = itemImg[0];
                    } else {
                        newproducts[uniqKEY].img = item.thumbnail;
                    }
                    newproducts[uniqKEY].title = fatheritem.title;
                    newproducts[uniqKEY].colortitle = item.title;
                    newproducts[uniqKEY].colorurl = item.url;
                    newproducts[uniqKEY].id = uniqKEY;
                    newproducts[uniqKEY].sales = item.sales;
                    newproducts[uniqKEY].pid = fatheritem.id;
                    newproducts[uniqKEY].url = fatheritem.url;
                    newproducts[uniqKEY].price = item.price;
                    newproducts[uniqKEY].views = item.views;
                    newproducts[uniqKEY].designer = fatheritem.designer;
                    newproducts[uniqKEY].key = fatheritem.id + '-' + item.id;
                    let productcount = 0;
                    if (self.isJSON(item.sizes)) {
                        JSON.parse(item.sizes).map(function (itemsizes) {
                            productcount += parseInt(itemsizes['count']);
                        });
                    }
                    newproducts[uniqKEY].count = productcount;
                    uniqKEY++;
                });
            });
            newproducts = newproducts.sort((a, b) => b.id - a.id);
            let goproduct = localStorage.getItem('goproduct');
            this.setState({rawproducts: products, products: newproducts}, () => {
                this.setState({'loading': false});
                // this.queryConfig();
                if (sort) {
                    this.setState({sort})
                }
                this.backToPosition();
            });
        }
        this.setState({sql: sql});
        this.setState({title: sql.name});
        this.setState({content: sql.content});
        this.setState({logo: sql.logo});
        this.setState({img: sql.slider});
        $('header').addClass('littleenginegone');
        $('header').append('<img src="' + sliderimg + '" class="lilengineimg" draggable="false">');
        $('body').removeClass('loading');
        $(".owl-carousel").trigger('refresh.owl.carousel');
        if (sql == '404' || sliderimg === null) {
            $('header').removeClass('littleenginegone');
            $('.lilengine,.lilengineimg').remove();
        }
    }

    backToPosition() {
        let goproduct = localStorage.getItem('goproduct');
        if (typeof goproduct !== 'undefined' && goproduct !== null) {
            let getproductelement = $('.iproduct-' + goproduct);
            if (getproductelement.length != 0) {
                setTimeout(function () {
                    getproductelement = $('.iproduct-' + goproduct);
                    let goproductint = parseInt(getproductelement.offset().top);
                    if ($(window).width() < 1000) {
                        goproductint = goproductint - 100;
                    }
                    $('html,body').animate({scrollTop: goproductint}, 100);
                }, 300);
            }
            localStorage.removeItem('goproduct');
        }
    }

    isJSON(str) {
        try {
            return (JSON.parse(str) && !!str);
        } catch (e) {
            return false;
        }
    }

    componentWillUnmount() {
        $('header').removeClass('littleenginegone');
        $('.lilengine,.lilengineimg').remove();
    }

    toEnglishDigits(str) {
        if (this.props.locale != 'fa' && this.props.locale != 'ar') {
            return str
        }
        var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return str.replace(/[0-9]/g, function (w) {
            return id[+w];
        });
    }

    numberWithCommas(x) {
        return this.toEnglishDigits(x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));
    }

    sortByValuable() {
        const {products} = this.state;
        let newProdList = products.reverse();
        this.setState({
            sortset: true,
            sort: 'highest-price',
            products: newProdList.sort((a, b) => b.price - a.price || b.id - a.id)
        });
        this.addQuery('sort', 'highest-price');
    }

    sortByCutrate() {
        const {products} = this.state;
        let newProdList = products.reverse();
        this.setState({
            sortset: true,
            sort: 'lowest-price',
            products: newProdList.sort((a, b) => a.price - b.price || b.id - a.id)
        });
        this.addQuery('sort', 'lowest-price');
    }

    sortByHit() {
        const {products} = this.state;
        this.setState({
            sortset: true,
            sort: 'most-popular',
            products: products.sort((a, b) => b.views - a.views || b.id - a.id)
        });
        this.addQuery('sort', 'most-popular');
    }

    sortByNewest() {
        const {products} = this.state;
        let newProdList = products.reverse();
        this.setState({sortset: true, sort: 'the-newest', products: newProdList.sort((a, b) => b.id - a.id)});
        this.addQuery('sort', 'the-newest');
    }

    sortActive() {
        if (this.state.sortActive) {
            this.setState({'sortActive': false});
        } else {
            this.setState({'sortActive': true});
        }
    }

    queryConfig() {
        const query = this.props.router.query;
        let sort, pricing, designer = null;
        if (query) {
            const searchParams = new URLSearchParams(this.props.router.query);
            sort = searchParams.get("sort");
            // pricing=new URLSearchParams(this.props.location.search).get("pricing");
            // designer=new URLSearchParams(this.props.location.search).get("designer");
            // if(pricing){
            //     pricing=pricing.split('-');
            //     this.setState({price:{min:parseInt(pricing[0]),max:parseInt(pricing[1])}});
            //     $('.filterPriceAreaInputMin').val(parseInt(pricing[0]));
            //     $('.filterPriceAreaInputMax').val(parseInt(pricing[1]));
            // }
            // if(designer){
            //     designer=designer.split('-');
            //     this.setState({designer:designer});
            // }
        }
        if (!this.state.sortset && !sort && this.props.config) {
            sort = this.props.config.defaultsort;
        }
        if (sort && sort == 'most-popular') {
            this.sortByHit();
        }
        if (sort && sort == 'the-newest') {
            this.sortByNewest();
        }
        if (sort && sort == 'lowest-price') {
            this.sortByCutrate();
        }
        if (sort && sort == 'highest-price') {
            this.sortByValuable();
        }
    }

    addQuery(key, value) {
        let pathname = window.location.pathname
        let searchParams = new URLSearchParams(window.location.search);
        searchParams.set(key, value);
        Router.push({
            pathname: pathname,
            query: searchParams.toString()
        }, undefined, {scroll: false}).then(() => {
            const pipies = $('.designerpipies');
            if (pipies.length != 0) {
                $('html,body').animate({scrollTop: parseInt(pipies.offset().top)}, 100);
            }
        });
    }

    substrBytes(str, start, length) {
        let buf = str;
        return buf.slice(start, start + length).toString();
    }

    productSorter(e) {
        $(e.currentTarget).toggleClass('active');
    }

    goProduct(e) {
        localStorage.setItem('goproduct', e.currentTarget.dataset.key);
    }

    mulababy(cash) {
        switch (this.props.locale) {
            case 'en':
                cash = '$ ' + Math.floor(cash / this.props.config.USD)
                break;
            case 'ar':
                cash = Math.floor(cash / this.props.config.DR) + ' درهم'
                break;
            case 'fa':
                cash += ' تومان'
                break;
            default:
                return cash
        }
        return this.numberWithCommas(cash)
    }

    render() {
        let self = this;
        let cpid;
        let products = [];
        // let encodeUrl=(str)=>{return str.replace(/ /g,'-')}
        let encodeUrl = (str) => {
            if (!str) {
                return '-';
            }
            return str.replace(/ /g, '-')
        }
        let decodeUrl = (str) => {
            return str.replace(/-/g, ' ')
        }
        let paginateactive = false;
        const iprops = translate[this.props.locale]
        if (this.state.products) {
            products = Object.values(this.state.products).map(function (value, key) {
                let producturl = value.title;
                let productprice = value.price;
                let coupon = false;
                let couponpercent = 0;
                if (value.url != '' && value.url != null) {
                    producturl = value.url;
                }
                {
                    self.props.coupons && Object.values(self.props.coupons).map(function (couponvalue, couponkey) {
                        if (!coupon && couponvalue.type == 'product' && (couponvalue.target == 'all' || couponvalue.target == value.pid)) {
                            if (couponvalue.numtype == 'percent') {
                                productprice = productprice - ((couponvalue.num / 100) * productprice);
                                couponpercent = couponvalue.num;
                            } else {
                                productprice = productprice - couponvalue.num;
                                couponpercent = Math.floor(((value.price - productprice) / value.price) * 100);
                            }
                            if (productprice < 0) {
                                productprice = 0;
                            }
                            coupon = true;
                        }
                    })
                }
                let brandname = '';
                if (self.props.designers) {
                    self.props.designers.forEach(function (item, i) {
                        if (value.designer == item.id) {
                            brandname = item.brand;
                        }
                    });
                }
                const goldenkey = value.pid + '-' + value.id
                return (<Link
                    href={`/product-${value.pid}/${encodeURIComponent(encodeUrl(producturl))}#${encodeUrl(value.colorurl)}`}
                    key={key}><a data-key={goldenkey}
                                 className={`iproduct-${goldenkey} catpreviewitem squareitem animated fadeIn`}
                                 onClick={self.goProduct.bind(this)}>
                    <div className="squarecontent">
                        <div className="catpreviewimg animated fadeIn delay-1s"><img
                            alt={value.title + ' ' + value.colortitle} title={value.title + ' ' + value.colortitle}
                            src={value.img}/>{coupon ? (<span
                            className="catpreviewcoupon">% {self.toEnglishDigits(couponpercent.toString())}</span>) : ('')}
                        </div>
                        <div className="catpreviewitembar">
                            <h5>{brandname}</h5>
                            <div className="catpreviewcat" data-for={`enrich`}
                                 data-tip={value.title + ' ' + value.colortitle}>{self.substrBytes(value.title, 0, 30) == value.title ? (value.title) : (self.substrBytes(value.title, 0, 30) + '...')}</div>
                            {value.count == 0 ? (<div className="catpreviewprice"><span>ناموجود</span></div>) : (<>
                                <div className="catpreviewprice">
                                    <span>{self.mulababy(value.price)}</span>
                                    {coupon ? (<span>{self.mulababy(productprice)}</span>) : ('')}
                                </div>
                            </>)}
                        </div>
                    </div>
                </a></Link>);
                key += 1;
            });
            if (this.state.products.length == 0 || !this.state.products) {
                products = (<div key={`zero2`} className="catpreviewitem squareitem animated fadeIn squarenotfound">
                    <div className="squarecontent">
                        <div className="squareTitle squareInLoad">در حال پردازش</div>
                    </div>
                </div>);
            } else {
                paginateactive = true;
            }
        } else {
            products = (<div key={`zero`} className="catpreviewitem squareitem animated fadeIn squarenotfound">
                <div className="squarecontent">
                    <div className="squareTitle">محصولی یافت نشد!</div>
                </div>
            </div>);
        }
        if (this.state.sql == '404') {
            this.props.redirect('/404');
        }
        return (<React.Fragment>
            {/* <Helmet>
            <title>{this.state.title+window.configMasterTitle}</title>
            <link rel="canonical" href={window.location.href} />
            <meta name="description" content={this.state.content}/>
            <meta property="og:title" content={this.state.title} />
            <meta property="og:description" content={this.state.content} />
      </Helmet> */}
            <div className="whereami inmobile">
                <a></a>
                <a></a>
                <Link href="/">{iprops.home}</Link>
                <Link href="/designers">{iprops.designers}</Link>
                <a>{this.state.title}</a>
            </div>
            <section className="_designersingle">
                <div className="container-cafca">
                    {this.state.img ? ('') : (<React.Fragment>
                        <img src="/img/designer-nobanner.svg" alt="nobanner"
                             style={{marginBottom: !this.state.loading ? 15 : 0}} className="nobanner"/>
                    </React.Fragment>)}
                    {this.state.content != '' ? (<>
                        <div
                            className="titlebar titlebar-pink">{iprops.about} {this.state.sql ? this.state.sql.brand : 'طراح'}</div>
                        <div className={`designerabt`}>
                            <div className="designerabtRight">
                                <img alt={this.state.title} src={this.state.logo}/>
                                <h5>{this.state.title}</h5>
                            </div>
                            <div className="designerabtLeft">{this.state.content}</div>
                        </div>
                    </>) : ''}
                </div>
            </section>
            {this.state.content != '' ? <section className="designerpipies">
                <div className="container-cafca">
                    <div
                        className="titlebar titlebarpro mb-0">{this.props.locale == 'fa' || this.props.locale == 'ar' ? iprops.products + ' ' : ''}{this.state.sql ? this.state.sql.brand : 'طراح'}{this.props.locale != 'fa' & this.props.locale != 'ar' ? ' ' + iprops.products : ''}
                        <div className="productSorter" onClick={this.productSorter.bind(this)}>
                            <div onClick={this.sortActive} className={`catpreviewfilterbox`}>
                                <a onClick={this.sortByHit}
                                   className={self.state.sort == 'most-popular' ? 'active' : null}>{iprops.sortByHit}</a>
                                <a onClick={this.sortByNewest}
                                   className={self.state.sort == 'the-newest' ? 'active' : null}>{iprops.sortByNewest}</a>
                                <a onClick={this.sortByValuable}
                                   className={self.state.sort == 'highest-price' ? 'active' : null}>{iprops.sortByValuable}</a>
                                <a onClick={this.sortByCutrate}
                                   className={self.state.sort == 'lowest-price' ? 'active' : null}>{iprops.sortByCutrate}</a>
                            </div>
                        </div>

                    </div>
                    <div className="catpreview wrapcatpreview">
                        <div className="catpreviewstage">
                            <div className="catpreviewbar">
                                <div className={`catpreviewfilter${this.state.sortActive ? (' active') : ('')}`}>
                                    <span>{iprops.filterby}:  </span>
                                    <div onClick={this.sortActive} className={`catpreviewfilterbox`}>
                                        <a onClick={this.sortByHit}
                                           className={self.state.sort == 'most-popular' ? 'active' : null}>{iprops.sortByHit}</a>
                                        <a onClick={this.sortByNewest}
                                           className={self.state.sort == 'the-newest' ? 'active' : null}>{iprops.sortByNewest}</a>
                                        <a onClick={this.sortByValuable}
                                           className={self.state.sort == 'highest-price' ? 'active' : null}>{iprops.sortByValuable}</a>
                                        <a onClick={this.sortByCutrate}
                                           className={self.state.sort == 'lowest-price' ? 'active' : null}>{iprops.sortByCutrate}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {products}
                        {/* products.push(<div className="pagination">
        <div className="paginateprev">صفحه قبل</div>
          <div className="paginateriver">
            <i class="active">1</i>
            <i>2</i>
            <i>3</i>
            <i>...</i>
            <i>4</i>
            <i>5</i>
          </div>
        <div className="paginateprev">صفحه بعد</div>
      </div>); */}

                        <ReactTooltip backgroundColor="#a1b7a1f0" textColor="#222" id={`enrich`}/>

                    </div>


                    {/* <ProductsPreview {...this.props} title={this.state.title} coupons={this.props.coupons} products={this.state.products}/> */}
                </div>
            </section> : ''}
        </React.Fragment>)
    }
})