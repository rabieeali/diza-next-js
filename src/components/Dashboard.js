import React, {Component} from 'react';
import {withRouter} from 'next/router'
import Link from 'next/link';
// import Parser from 'html-react-parser';
import $ from 'jquery';
import {postData} from '../lib/postData';
import Profile from './Profile';
import Login from './Login';
import moment from 'moment-jalaali';
import ReactTooltip from 'react-tooltip';
import Lastvisits from './LastVisits';
import translate from '@/config/translate';

class Favorites extends Component {
    constructor(props) {
        super(props);
        this.state = {
            favorites: [], datageted: false, favoritefill: true, userData: this.props.userData
        }
        this.getFavorites = this.getFavorites.bind(this);
        this.goProduct = this.goProduct.bind(this);
    }

    componentDidMount() {
        this.getFavorites();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userData !== this.props.userData) {
            this.getFavorites();
        }
    }

    getFavorites() {
        if (this.props.userData) {
            this.setState({'userData': this.props.userData});
            let updateData = {locale: this.props.locale, userphone: JSON.parse(this.props.userData).userphone}
            let goproduct = localStorage.getItem('goproduct');
            postData('getfavorites', updateData).then((result) => {
                this.setState({datageted: true, favorites: result.favorites});
                if (typeof goproduct !== 'undefined' && goproduct !== null) {
                    let getproductelement = $('.iproduct-' + localStorage.getItem('goproduct'));
                    if (getproductelement.length != 0) {
                        let goproductint = parseInt(getproductelement.offset().top);
                        if ($(window).width() < 1000) {
                            goproductint = goproductint - 100;
                        }
                        $('html,body').animate({scrollTop: goproductint}, 200);
                    }
                    localStorage.removeItem('goproduct');
                }
            });
        }
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

    substrBytes(str, start, length) {
        let buf = str;
        return buf.slice(start, start + length).toString();
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
        let encodeUrl = (str) => {
            return str.replace(/ /g, '-')
        }
        let decodeUrl = (str) => {
            return str.replace(/-/g, ' ')
        }
        let products;
        const iprops = this.props.iprops
        if (this.state.favorites) {
            products = Object.values(this.state.favorites).map(function (value, key) {
                let producturl = value.title;
                if (value.url != '' && value.url != null) {
                    producturl = value.url;
                }
                let valueprice = value.price;
                if (!value.price || value.price == '') {
                    valueprice = 0;
                }
                let brandname = '';
                if (self.props.designers) {
                    self.props.designers.forEach(function (item, i) {
                        if (value.designer == item.id) {
                            brandname = item.brand;
                        }
                    });
                }
                return (
                    <Link href={`/product-${value.id}/${encodeUrl(producturl)}#${encodeUrl(value.color)}`} key={key}><a
                        className={`iproduct-${key} noselect catpreviewitem squareitem animated fadeIn`}
                        onClick={self.goProduct.bind(this)} data-key={key}>
                        <div className="squarecontent">
                            <div className="catpreviewimg animated fadeIn delay-1s"><img
                                alt={value.title + ' ' + value.colortitle} title={value.title + ' ' + value.colortitle}
                                src={value.img}/></div>
                            <div className="catpreviewitembar">
                                <h5>{brandname}</h5>
                                <div className="catpreviewcat" data-for={`enrich`}
                                     data-tip={value.title + ' ' + value.colortitle}>{self.substrBytes(value.title, 0, 30) == value.title ? (value.title) : (self.substrBytes(value.title, 0, 30) + '...')}</div>
                                <div className="catpreviewprice"><span>{self.mulababy(valueprice)}</span></div>
                            </div>
                        </div>
                    </a></Link>
                );
                key += 1;
            });
            if (products.length == 0) {
                if (self.state.datageted) {
                    products = (<div key={`squarenotfound`}
                                     className="catpreviewitem squareitem animated fadeIn squarenotfound">
                        <div className="squarecontent">
                            <div className="squareTitle">{iprops.noproductsfound}!</div>
                        </div>
                    </div>);
                } else {
                    products = (
                        <div key={`squareloading`} className="catpreviewitem squareitem animated fadeIn squarenotfound">
                            <div className="squarecontent">
                                <div className="squareTitle">{iprops.processing}...</div>
                            </div>
                        </div>);
                }
            } else {
                products.push(<ReactTooltip key={`reacttooltip`} backgroundColor="#a1b7a1f0" textColor="#222"
                                            id={`enrich`}/>);
            }
        }
        return (
            <React.Fragment>
                <div className="catpreview">
                    {products}
                </div>
            </React.Fragment>
        )
    }
}

class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [], userData: false, datageted: false
        }
        this.orderdetailer = this.orderdetailer.bind(this);
        this.getOrders = this.getOrders.bind(this);
    }

    componentDidMount() {
        this.getOrders();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userData !== this.props.userData) {
            this.getOrders();
        }
    }

    getOrders() {
        if (this.props.userData) {
            this.setState({'userData': this.props.userData});
            let updateData = {userphone: JSON.parse(this.props.userData).userphone}
            postData('getorders', updateData).then((result) => {
                this.setState({orders: result.orders, datageted: true})
            });
            // alert(this.state);
        }
    }

    orderdetailer(id) {
        $('.orderlistcarts-' + id).toggleClass('active');
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

    // timeConverter(UNIX_timestamp){
    //     var a = new Date(UNIX_timestamp * 1000);
    //     var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    //     var year = a.getFullYear();
    //     var month = months[a.getMonth()];
    //     var date = a.getDate();
    //     var hour = a.getHours();
    //     var min = a.getMinutes();
    //     var sec = a.getSeconds();
    //     var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    //     return time;
    // }
    render() {
        let self = this;
        const iprops = this.props.iprops
        let encodeUrl = (str) => {
            return str.replace(/ /g, '-')
        }
        let decodeUrl = (str) => {
            return str.replace(/-/g, ' ')
        }
        let orders;
        let valuenum = 0;
        let hourago = moment().toDate().getTime() - ((1000 * 60 * 60) * (24 * 5)); // 5Days
        // let hourago = moment().toDate().getTime() - (1000*60*60); // 1Hour
        // console.log(self.timeConverter(hourago));
        // console.log(hourago);
        if (this.state.orders) {
            orders = Object.values(this.state.orders).map(function (value, key) {
                valuenum++;
                let repayorder = '';
                let valuestate = (<b style={{color: 'red'}}>{iprops.dashboard.faild}</b>);
                if (value.status == 1) {
                    valuestate = (<b style={{color: 'green'}}>{iprops.dashboard.successful}</b>);
                }
                if (value.payin == 'home') {
                    valuestate = (<b>{iprops.dashboard.payathome}</b>);
                    if (value.status == 2) {
                        valuestate = (<b>{iprops.dashboard.returnedpayathome}</b>);
                    }
                }
                if (value.status != 1 && value.payin != 'home' && hourago < moment(value.created_at)) {
                    repayorder = (<div className="orderlistitemcol orderlistitemcolvertical"><a
                        href={`/cart/gopal/${value.orderid}`}>پرداخت مجدد</a></div>);
                }

                let orderdetail = Object.values(JSON.parse(value.products)).map(function (valueZ, keyZ) {
                    if (valueZ != null) {
                        return (<div className="orderlistcart" key={`order-r-${key}`}>
                            <div className="orderlistcartcol">
                                <span>{iprops.dashboard.product}</span><span>{valueZ.title}{valueZ.customsew ? ' (' + iprops.dashboard.customized + ')' : ''}</span>
                            </div>
                            <div className="orderlistcartcol">
                                <span>{iprops.dashboard.count}</span><span>{valueZ.count}</span></div>
                            <div className="orderlistcartcol">
                                <span>{iprops.dashboard.amount}</span><span>{self.mulababy(valueZ.amount)}</span></div>
                        </div>);
                    }
                });
                const created_at = self.props.locale == 'fa' ? self.toEnglishDigits(moment(value.created_at).format('jYYYY/jM/jD').toString()) : self.toEnglishDigits(moment(value.created_at).format('jYYYY/jM/jD').toString());
                return (
                    <>
                        <div className="orderlistitem" key={`order-${key}`}>
                            <div className="orderlistitemcol">
                                <span>{iprops.dashboard.referralcode}</span><span>{value.orderid}</span></div>
                            <div className="orderlistitemcol">
                                <span>{iprops.dashboard.orderdate}</span><span>{created_at}</span></div>
                            <div className="orderlistitemcol">
                                <span>{iprops.dashboard.finalamount}</span><span>{self.mulababy(value.amount)}</span>
                            </div>
                            <div className="orderlistitemcol">
                                <span>{iprops.dashboard.grievance.status}</span><span>{valuestate}</span></div>
                            {value.status == 1 || (value.payin == 'home' && value.status != 2) ? (
                                <div className="orderlistitemcol"><a href={`/factor/${value.orderid}`} rel="noreferrer"
                                                                     target="_blank">{iprops.dashboard.downloadinvoice}</a>
                                </div>) : (<React.Fragment>{repayorder}
                                <div className="orderlistitemcol"></div>
                            </React.Fragment>)}
                            <div className="orderlistitemcol"><a onClick={() => self.orderdetailer(key)}
                                                                 data-products={value.products}>{iprops.dashboard.orderdetails}</a>
                            </div>
                        </div>
                        <div className={`orderlistcarts orderlistcarts-${key}`}
                             key={`order-d-${key}`}>{orderdetail}</div>
                    </>
                );
            });
            if (orders.length == 0) {
                if (this.state.datageted) {
                    orders = (<div key={`order0`}>
                        {iprops.dashboard.myordersempty}.
                    </div>);
                } else {
                    orders = (<div key={`order00`}>
                        {iprops.processing} ...
                    </div>);
                }
            }
        }
        return (
            <React.Fragment>
                <div className="mainbox animated fadeIn" key={`order-result`}>
                    <div className="maintitle">{iprops.dashboard.myorders}</div>
                    {orders}
                </div>
            </React.Fragment>
        )
    }
}

class Gifts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gifts: [], userData: false, datageted: false
        }
        this.getGifts = this.getGifts.bind(this);
        this.giftdetailer = this.giftdetailer.bind(this);
    }

    componentDidMount() {
        this.getGifts();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userData !== this.props.userData) {
            this.getGifts();
        }
    }

    getGifts() {
        if (this.props.userData) {
            this.setState({'userData': this.props.userData});
            let updateData = {userphone: JSON.parse(this.props.userData).userphone}
            postData('getgifts', updateData).then((result) => {
                this.setState({gifts: result.gifts, datageted: true})
            });
        }
    }

    giftdetailer(id) {
        $('.orderlistcarts-' + id).toggleClass('active');
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

    render() {
        let self = this;
        const iprops = this.props.iprops
        let encodeUrl = (str) => {
            return str.replace(/ /g, '-')
        }
        let decodeUrl = (str) => {
            return str.replace(/-/g, ' ')
        }
        let gifts = [];
        let valuenum = 0;
        if (this.state.gifts) {
            gifts = Object.values(this.state.gifts).map(function (value, key) {
                valuenum++;
                let repayorder = '';
                let valuestate = (<b style={{color: 'red'}}>{iprops.dashboard.faild}</b>);
                if (value.status == 1) {
                    valuestate = (<b style={{color: 'green'}}>{iprops.dashboard.successful}</b>);
                } else {
                    repayorder = (
                        <div className="orderlistitemcol orderlistitemcolvertical" key={`orderlistitemcolvertical`}><a
                            href={`/gift/gopal/${value.orderid}`}>{iprops.dashboard.repayment}</a></div>);
                }
                let giftdetail = (<div className="orderlistcart" key={`gift-r-${key}`}>
                    <div className="orderlistcartcol">
                        <span>{iprops.dashboard.gifttype}</span><span>{value.type == 'online' ? iprops.dashboard.digital : iprops.dashboard.physical}</span>
                    </div>
                    <div className="orderlistcartcol">{value.type == 'online' ? (<>
                        <span>{iprops.dashboard.link}</span><span><a target="_blank" rel="noreferrer"
                                                                     href={`https://diza.gallery/gift/${value.orderid}`}
                                                                     style={{color: '#777777'}}>https://diza.gallery/gift/{value.orderid}</a></span></>) : (<>
                        <span>{iprops.dashboard.couponcode}</span><span>{value.couponcode}</span></>)}</div>
                    <div className="orderlistcartcol">
                        <span>{iprops.dashboard.amount}</span><span>{self.numberWithCommas(value.amount)}</span></div>
                </div>);
                const created_at = self.props.locale == 'fa' ? self.toEnglishDigits(moment(value.created_at).format('jYYYY/jM/jD').toString()) : self.toEnglishDigits(moment(value.created_at).format('jYYYY/jM/jD').toString());
                return (
                    <>
                        <div className="orderlistitem" key={`order-${key}`}>
                            <div className="orderlistitemcol">
                                <span>{iprops.dashboard.referralcode}</span><span>{value.orderid}</span></div>
                            <div className="orderlistitemcol">
                                <span>{iprops.dashboard.orderdate}</span><span>{created_at}</span></div>
                            <div className="orderlistitemcol">
                                <span>{iprops.dashboard.finalamount}</span><span>{self.mulababy(value.amount)}</span>
                            </div>
                            <div className="orderlistitemcol">
                                <span>{iprops.dashboard.grievance.status}</span><span>{valuestate}</span></div>
                            {value.status == 0 ? (<React.Fragment>{repayorder}
                                <div className="orderlistitemcol"></div>
                            </React.Fragment>) : (<div className="orderlistitemcol"></div>)}
                            <div className="orderlistitemcol"><a onClick={() => self.giftdetailer(key)}
                                                                 data-data={value}>{iprops.dashboard.giftdetails}</a>
                            </div>
                        </div>
                        <div className={`orderlistcarts orderlistcarts-${key}`} key={`gift-d-${key}`}>{giftdetail}</div>
                    </>
                );
            });
            if (gifts.length == 0) {
                if (this.state.datageted) {
                    gifts = (<div key={`order0`}>
                        {iprops.dashboard.mygiftsempty}.
                    </div>);
                } else {
                    gifts = (<div key={`order00`}>
                        {iprops.processing} ...
                    </div>);
                }
            }
        }
        return (<div className="mainbox animated fadeIn" key={`order-result`}>
            <div className="maintitle">{iprops.dashboard.mygifts}</div>
            {gifts}
        </div>)
    }
}

class Notices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notices: [], userData: false, datageted: false
        }
        this.getNotices = this.getNotices.bind(this);
        this.toggleNotice = this.toggleNotice.bind(this);
    }

    componentDidMount() {
        this.getNotices();
    }

    getNotices() {
        if (this.props.userData) {
            this.setState({'userData': this.props.userData});
            let updateData = {userphone: JSON.parse(this.props.userData).userphone}
            postData('getnotices', updateData).then((result) => {
                if (result.notices) {
                    this.setState({notices: result.notices, datageted: true});
                } else {
                    this.setState({datageted: true});
                }
            });
        }
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

    componentDidUpdate(prevProps) {
        if (prevProps.userData !== this.props.userData) {
            this.getNotices();
        }
    }

    toggleNotice(e) {
        let togglevalue = $(e.currentTarget).parent().hasClass('active');
        if (togglevalue) {
            togglevalue = 0;
        } else {
            togglevalue = 1;
        }
        let toggleid = $(e.currentTarget).parent().parent().parent().parent().data('query');
        $(e.currentTarget).parent().toggleClass('active');
        let updateData = {
            userphone: JSON.parse(this.props.userData).userphone,
            toggleid: toggleid,
            togglevalue: togglevalue
        }
        postData('setnotice', updateData);
    }

    render() {
        let self = this;
        let encodeUrl = (str) => {
            return str.replace(/ /g, '-')
        }
        let decodeUrl = (str) => {
            return str.replace(/-/g, ' ')
        }
        const iprops = this.props.iprops
        let notices = Object.values(this.state.notices).map(function (value, key) {
            let producttitle = value.producttitle;
            if (!producttitle) {
                producttitle = iprops.comment.untitled;
            }
            if (value.producturl) {
                producttitle = value.producturl
            }
            let brandname = '';
            if (self.props.designers) {
                self.props.designers.forEach(function (item, i) {
                    if (value.productdesigner == item.id) {
                        brandname = item.brand;
                    }
                });
            }
            let producturl = `/product-${value.productid}/${encodeUrl(producttitle)}#${value.productcolor}`;
            return (<div className="orderlistitem" data-query={value.id} key={`notices-${key}`}>
                <div className="orderlistitemcol"><span>{iprops.dashboard.productname}</span><span><Link
                    href={producturl}><a
                    className="bluelink">{value.producttitle ? value.producttitle : iprops.comment.untitled}</a></Link></span>
                </div>
                <div className="orderlistitemcol"><span>{iprops.dashboard.brandname}</span><span>{brandname}</span>
                </div>
                <div className="orderlistitemcol">
                    <span>{iprops.dashboard.noticetype}</span><span>{value.notif == 'inventory' ? (iprops.dashboard.inventory) : (iprops.dashboard.discount)}</span>
                </div>
                <div className="orderlistitemcol"><span>{iprops.dashboard.settings}</span><span><div
                    className={`noselect togglebtn${value.is_active ? (' active') : ('')}`}><b>{iprops.dashboard.active}</b><span
                    onClick={self.toggleNotice.bind(this)}></span><b>{iprops.dashboard.inactive}</b></div></span></div>
                <div className="orderlistitemcol"></div>
                <div className="orderlistitemcol"></div>
            </div>);
        });
        // {notices.length==0 && ()}
        if (notices.length == 0 && !this.state.datageted) {
            notices = iprops.processing + ' ...';
        }
        if (notices.length == 0 && this.state.datageted) {
            notices = iprops.dashboard.emptynotice + '.';
        }
        return (<div className="mainbox animated fadeIn" key={`order-result`}>
            <div className="maintitle">{iprops.dashboard.notifications}</div>
            {notices}</div>)
    }
}

class Grievance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [], grievances: [], userData: false, datageted: false
        }
        this.orderdetailer = this.orderdetailer.bind(this);
        this.getOrders = this.getOrders.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        this.getOrders();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userData !== this.props.userData) {
            this.getOrders();
        }
    }

    getOrders() {
        if (this.props.userData) {
            this.setState({'userData': this.props.userData});
            let updateData = {userphone: JSON.parse(this.props.userData).userphone}
            postData('getorders', updateData).then((result) => {
                this.setState({orders: result.orders, grievances: result.grievances, datageted: true})
            });
        }
    }

    orderdetailer(id) {
        $('.orderlistcarts-' + id).toggleClass('active');
    }

    submit(e) {
        const iprops = this.props.iprops
        let order = $('.grievanceOrder').val();
        let description = $('.grievanceDescription').val();
        let btn = $(e.currentTarget);
        if (description.length < 6) {
            $('.mainbox:nth-child(1) .maintitle').after('<div class="alertMessage error mb-1 animated fadeIn">لطفا دلایل خود را برایمان بنویسید.</div>');
            $('.grievanceDescription').focus();
            setTimeout(function () {
                $('.alertMessage.error').remove();
            }, 2000);
        } else {
            let updateData = {order: order, description: description, userData: JSON.parse(this.props.userData)};
            postData('newgrievance', updateData).then((result) => {
                $('.mainbox:nth-child(1) .maintitle').after('<div class="alertMessage success mb-1 animated fadeIn">درخواست شما با موفقیت ثبت شد، از شما متشکریم.</div>');
                btn.attr('disabled', true);
                $('.grievanceOrder').attr('disabled', true);
                $('.grievanceDescription').attr('disabled', true);
                this.setState({grievances: result.grievances})
            });
        }
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

    render() {
        let self = this;
        const iprops = this.props.iprops
        return (
            <React.Fragment>
                <div className="mainbox animated fadeIn">
                    <div className="maintitle">{iprops.dashboard.grievance.title}</div>
                    {self.state.orders ? (<React.Fragment>
                        {self.state.orders.length == 0 ? (<React.Fragment>
                            {self.state.datageted ? (<span>{iprops.dashboard.grievance.error}.</span>) : (
                                <span>{iprops.processing} ...</span>)}
                        </React.Fragment>) : (<React.Fragment>
                            <div className="mainrow">
                                <div className="maincol input">{iprops.dashboard.grievance.order} : <select
                                    className="grievanceOrder select2">
                                    {self.state.orders.map(function (item, i) {
                                        return (<option key={`order-${i}`}
                                                        value={item.orderid}>{iprops.dashboard.grievance.ordercode}: {item.orderid} ─ {iprops.dashboard.grievance.orderamount}: {self.mulababy(item.amount)}</option>)
                                    })}
                                </select></div>
                            </div>
                            <div className="mainrow">
                                <div className="maincol" style={{
                                    paddingBottom: 10,
                                    paddingTop: 5
                                }}>{iprops.dashboard.grievance.description} : <textarea className="grievanceDescription"
                                                                                        placeholder={`${iprops.dashboard.grievance.description}...`}></textarea>
                                </div>
                            </div>
                            <button className="btn" style={{marginRight: 5, marginBottom: 5}}
                                    onClick={self.submit}>{iprops.dashboard.grievance.submit}</button>
                        </React.Fragment>)}
                    </React.Fragment>) : null}
                </div>
                {/* <div className="mainbox animated fadeIn">
                <div className="maintitle">درخواست برای ارجاع کالا</div>
                با شماره تماس (۰۲۱) - ۸۸۸۲۱۱۱۰ خدمات پس از فروش (داخلی ۲) تماس بگیرید.<br/>
                و یا پیام خود را در صفحه "تماس با ما" برای خدمات پس از فروش ارسال کنید.
            </div> */}
                <div className="mainbox animated fadeIn delay-1s">
                    <div className="maintitle">{iprops.dashboard.grievance.referralhistory}</div>
                    {self.state.grievances ? (<React.Fragment>
                        {self.state.grievances.length == 0 ? (<React.Fragment>
                            {self.state.datageted ? (<span>{iprops.dashboard.grievance.empty}!</span>) : (
                                <span>{iprops.processing} ...</span>)}
                        </React.Fragment>) : (<React.Fragment>
                            {self.state.grievances.map(function (item, i) {
                                let status = (<b style={{padding: 5}}>{iprops.dashboard.grievance.pending}</b>);
                                if (item.state == 1) {
                                    status = (<b style={{
                                        color: 'green',
                                        padding: 5
                                    }}>{iprops.dashboard.grievance.approved}</b>);
                                } else if (item.state == 2) {
                                    status = (<b style={{
                                        color: 'red',
                                        padding: 5
                                    }}>{iprops.dashboard.grievance.notapproved}</b>);
                                }
                                const created_at = self.props.locale == 'fa' ? self.toEnglishDigits(moment(item.created_at).format('jYYYY/jM/jD').toString()) : self.toEnglishDigits(moment(item.created_at).format('jYYYY/jM/jD').toString());
                                return (<div className="orderlistitem" key={`grieorders-${i}`}>
                                    <div className="orderlistitemcol">
                                        <span>{iprops.dashboard.grievance.ordercode}</span><span>{item.orderid}</span>
                                    </div>
                                    <div className="orderlistitemcol">
                                        <span>{iprops.dashboard.grievance.eventdate}</span><span>{created_at}</span>
                                    </div>
                                    <div className="orderlistitemcol">
                                        <span>{iprops.dashboard.grievance.status}</span><span>{status}</span></div>
                                    <div className="orderlistitemcol"></div>
                                    <div className="orderlistitemcol"></div>
                                </div>);
                            })}
                        </React.Fragment>)}
                    </React.Fragment>) : <span>{iprops.dashboard.grievance.empty}!</span>}
                </div>
            </React.Fragment>
        )
    }
}

class Suggestions extends Component {
    constructor(props) {
        super(props);
        this.state = {suggestcontent: null, status: ''}
    }

    componentDidMount() {
        const self = this;
        const iprops = this.props.iprops
        $(document).on('click', '#suggestsubmit', function () {
            const suggestcontent = $('#suggestcontent').val();
            if (suggestcontent.length <= 10) {
                self.setState({status: 'error'}, () => {
                    setTimeout(() => self.setState({status: ''}), 1500);
                })
                // $('.maintitle').after('<div class="alertMessage error mb-1 animated fadeIn">'+iprops.dashboard.suggestions.error+'.</div>');
                // setTimeout(function(){$('.alertMessage').remove();},1000);
            } else {
                self.setState({'suggestcontent': suggestcontent}, () => {
                    $('#suggestcontent').attr('disabled', true);
                    $('#suggestsubmit').attr('disabled', true);
                    let localUserData = JSON.parse(localStorage['userData']);
                    let updateData = {comment: suggestcontent, userData: localUserData};
                    postData('newsuggest', updateData).then((result) => {
                        self.setState({status: 'success'})
                    });
                });
            }
        });
    }

    render() {
        const iprops = this.props.iprops
        return (
            <React.Fragment>
                <div className="mainbox animated fadeIn">
                    <div className="maintitle">{iprops.dashboard.criticsandsuggestions}</div>
                    {this.state.status == 'error' ? <div
                        className="alertMessage error mb-1 animated fadeIn">{iprops.dashboard.suggestions.error}</div> : this.state.status == 'success' ?
                        <div
                            className="alertMessage success mb-1 animated fadeIn">{iprops.dashboard.suggestions.success}</div> : ''}
                    <p>{iprops.dashboard.suggestions.comment}.</p>
                    <textarea className="w-100 mt-1" id="suggestcontent" defaultValue={this.state.suggestcontent}
                              placeholder={`${iprops.dashboard.suggestions.placeholder}...`}/>
                    <button className="btn mx-0 mb-0 mt-1"
                            id="suggestsubmit">{iprops.dashboard.suggestions.submit}</button>
                </div>
            </React.Fragment>
        );
    }
}

class List extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.checkLogin();
        if ($(window).width() > 1000) {
            const self = this;
            setTimeout(() => self.props.redirect('/dashboard/profile'), 1000)
            // const _url=router.locale!='fa' ? '/'+router.locale+url : url
            // setTimeout(()=>{if(window.location.pathname!='/dashboard/profile'){window.location.replace('/dashboard/profile')}},2000)
        }
    }

    render() {
        return (
            <React.Fragment></React.Fragment>
        )
    }
}

export default withRouter(class Dashboarde extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogined: false,
            logout: false,
            redirect: false,
            url: this.props.router.query.url,
            userData: false,
            userName: 'کاربر گرامی'
        }
        this.checkLogin = this.checkLogin.bind(this);
        this.Action = this.Action.bind(this);
        this.logout = this.logout.bind(this);
        this.unlogout = this.unlogout.bind(this);
    }

    componentDidMount() {
        $('header,nav').addClass('minimize');
        if (this.props.router.query.action != 'login') {
            if (localStorage.getItem('userData') && localStorage.getItem('userData') != 'undefined') {
                this.setState({'isLogined': true});
                this.setState({'userData': localStorage.getItem('userData')});
                this.setState({'userName': JSON.parse(localStorage.getItem('userData')).fullname});
            } else {
                this.props.redirect('/dashboard/login');
            }
        }
    }

    componentDidUpdate() {
        const Matchurl = this.props.router.query.url;
        if (this.state.url != Matchurl) {
            if (!localStorage.getItem('userData')) {
                this.props.redirect('/dashboard/login');
            } else {
                this.setState({'userData': localStorage.getItem('userData')});
            }
            this.setState({'url': Matchurl});
        }
    }

    componentWillUnmount() {
        $('header,nav').removeClass('minimize');
    }

    Action($action) {
        $('.sidemenuitem').removeClass('active');
        $('.item-' + $action).addClass('active');
        // console.log($action);
        // $('.sidemenuitem').addClass('active');
        // $('.item:nth-child(1)').removeClass('active');
        const self = this
        const iprops = translate[this.props.locale]
        if ($action == 'list') {
            return (<List iprops={iprops} locale={this.props.locale} redirect={this.props.redirect}
                          checkLogin={this.checkLogin}/>);
        }
        if ($action == 'login') {
            return (<Login iprops={iprops} locale={this.props.locale} redirect={this.props.redirect}
                           checkLogin={this.checkLogin} parent="dashboard"/>);
        }
        if ($action == 'grievance') {
            return (
                <Grievance iprops={iprops} locale={this.props.locale} {...this.props} userData={this.state.userData}/>);
        }
        if ($action == 'orders') {
            return (<Orders iprops={iprops} config={this.props.config} locale={this.props.locale}
                            userData={this.state.userData}/>);
        }
        if ($action == 'gifts') {
            return (<Gifts iprops={iprops} config={this.props.config} locale={this.props.locale}
                           userData={this.state.userData}/>);
        }
        if ($action == 'profile') {
            return (<Profile iprops={iprops} locale={this.props.locale}/>);
        }
        if ($action == 'favorites') {
            return (
                <Favorites iprops={iprops} locale={this.props.locale} {...this.props} userData={this.state.userData}/>);
        }
        if ($action == 'suggestion') {
            return (<Suggestions iprops={iprops} locale={this.props.locale}/>);
        }
        if ($action == 'lastvisits') {
            return (<Lastvisits iprops={iprops} coupons={this.props.coupons} locale={this.props.locale} {...this.props}
                                userData={this.state.userData}/>);
        }
        if ($action == 'notices') {
            return (
                <Notices iprops={iprops} locale={this.props.locale} {...this.props} userData={this.state.userData}/>);
        }
        if ($action == 'logout') {
            localStorage.clear();
            self.props.redirect('/dashboard/login');
            return (<span>w8</span>)
        }
        // if($action=='logout' && !this.state.redirect){this.setState({'redirect':true,'logout':false,'isLogined':false},()=>{localStorage.clear();self.props.redirect('/dashboard/login')});/*return(<Redirect to="/dashboard/login"/>);*/}
    }

    checkLogin() {
        const iprops = translate[this.props.locale]
        if (localStorage.getItem('userData')) {
            this.setState({'isLogined': true}, () => {
                $('.navProf span,.navProfMobile span').html(iprops.userarea);
                $('.navProf,.navProfMobile').attr('href', '/dashboard/profile');
            });
        } else {
            this.setState({'isLogined': false}, () => {
                $('.navProf span,.navProfMobile span').html(iprops.loginsignup);
                $('.navProf,.navProfMobile').attr('href', '/dashboard/login');
            });
        }
    }

    logout() {
        this.setState({logout: true});
    }

    unlogout() {
        this.setState({logout: false});
    }

    render() {
        const {title, locale} = this.props
        const iprops = translate[locale]
        return (
            <div className="dashboard">
                <div className="container-cafca">
                    <div className="titlebar justinapp my-0">
                        <span>{title}</span>
                    </div>
                    <div className={`sideboard${this.props.router.query.action == 'list' ? ('') : (' hidden')}`}>
                        {this.state.isLogined ? (
                            <div
                                className="whoiam noselect">{locale != 'fa' ? iprops.dashboard.wellcome + ' ' : ''}{this.state.userName}{locale == 'fa' ? ' ' + iprops.dashboard.wellcome : ''} !</div>
                        ) : (
                            <div className="whoiam noselect">{iprops.loginsignup}</div>
                        )}
                        <div className="sidemenu">
                            <Link href="/dashboard/profile"><a
                                className="sidemenuitem item-profile">{iprops.dashboard.profile}</a></Link>
                            <Link href="/dashboard/favorites"><a
                                className="sidemenuitem item-favorites">{iprops.dashboard.wishlist}</a></Link>
                            <Link href="/dashboard/orders"><a
                                className="sidemenuitem item-orders">{iprops.dashboard.myorders}</a></Link>
                            <Link href="/dashboard/gifts"><a
                                className="sidemenuitem item-gifts">{iprops.dashboard.mygifts}</a></Link>
                            <Link href="/dashboard/grievance"><a
                                className="sidemenuitem item-grievance">{iprops.dashboard.referralrequest}</a></Link>
                            <Link href="/dashboard/notices"><a
                                className="sidemenuitem item-notices">{iprops.dashboard.notifications}</a></Link>
                            <Link href="/dashboard/suggestion"><a
                                className="sidemenuitem item-suggestion">{iprops.dashboard.criticsandsuggestions}</a></Link>
                            <Link href="/dashboard/lastvisits"><a
                                className="sidemenuitem item-lastvisits">{iprops.dashboard.recentvisits}</a></Link>
                            <a className="sidemenuitem item-logout" onClick={!this.state.logout ? this.logout : () => {
                            }}>{this.state.logout ? (<React.Fragment><a onClick={this.unlogout}
                                                                        className="unlogout">{iprops.dashboard.cancel}</a><Link
                                href="/dashboard/logout"><a className="inlogout">{iprops.dashboard.imsureofleaving}</a></Link></React.Fragment>) : (
                                <span>{iprops.dashboard.logout}</span>)}</a>
                        </div>
                    </div>
                    <div className="mainboard">
                        {this.Action(this.props.router.query.action)}
                    </div>
                </div>
            </div>
        );
    }
})