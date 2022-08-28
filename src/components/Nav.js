import React, {Component} from 'react';
import Link from 'next/link'
import Router from 'next/router'
import Cookies from 'universal-cookie';
import $ from 'jquery';
// import store from '../redux/store'
import translate from '../config/translate'
import {connect} from 'react-redux';
import {defaultConfig} from 'next/dist/server/config-shared';
// import dynamic from 'next/dynamic'
import Megabear from './Megabear';
import Begabear from './Begabear';

const cookies = new Cookies();
// const Megabear = dynamic(
//     () => import('./Megabear'),
//     { ssr: false, loading: ()=>false }
// )
// const Begabear = dynamic(
//     () => import('./Begabear'),
//     { ssr: false, loading: ()=>false }
// )

class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            comments: [],
            loggedIn: false,
            searchActive: false,
            query: '',
            moreShow: false,
            userName: 'حساب کاربری',
            sex: 0
        };
        this.goBack = this.goBack.bind(this);
        this.goSearch = this.goSearch.bind(this);
        this.checkLogin = this.checkLogin.bind(this);
        this.Search = this.Search.bind(this);
        this.UnSearch = this.UnSearch.bind(this);
        this.navCatOther = this.navCatOther.bind(this);
    }

    checkLogin() {
        if (localStorage.getItem('userData') && localStorage.getItem('userData') != 'undefined') {
            let userData = localStorage.getItem('userData');
            this.setState({'loggedIn': true, 'userName': JSON.parse(userData).fullname});
        } else {
            this.setState({'loggedIn': false});
        }
    }

    componentDidMount() {
        // let state = store.getState().root
        // console.log(state);

        const self = this;
        $(document).on('mouseenter', '.navCat a', function () {
            $('.navCat a').removeClass('active');
            $('body').removeClass('bearisangry dontbeangrybear');
            self.setState({sex: 0});
            if (!$(this).hasClass('nobear')) {
                let navName = $(this).data('sex');
                $('.menumany .manybox').removeClass('isfirst active');
                let isfirst = '';
                let isfirstnum = 0;
                $('.menumany .manybox').each(function () {
                    if (navName.indexOf($(this).data('sex')) != 2 && navName.indexOf($(this).data('sex')) != -1) {
                        if (isfirstnum == 0) {
                            isfirst = 'isfirst ';
                            isfirstnum += 1;
                        } else {
                            isfirst = '';
                        }
                        $(this).addClass(isfirst + 'active animated fadeIn');
                    }
                });
                $(this).addClass('active');
                if (!$(this).hasClass('havefar')) {
                    $('body').addClass('bearisangry dontbeangrybear');
                } else {
                    $('body').addClass('bearisangry');
                }
            }
        });
        $(document).on('mouseenter', '.menufar a', function () {
            $('body').removeClass('chinupbear');
            $('.menufar a').removeClass('active');
            $(this).addClass('active');
            let sex = ($(this).index()) + 1;
            self.setState({sex: sex});
            $('body').addClass('dontbeangrybear');
            $('.o_O').addClass('notsexy');
            $('.o_O').each(function () {
                if ($(this).hasClass('sex-' + sex)) {
                    $(this).removeClass('notsexy');
                }
                if (sex == 3) {
                    $('.o_O.sex-4').addClass('notsexy');
                } else {
                    $('.o_O.sex-4').removeClass('notsexy');
                }
            });
        });
        $(document).on('mouseleave', '.navCatVip,.navCatGift', function () {
            $('body').removeClass('bearisangry dontbeangrybear chinupbear');
            $('.menufar a,.navCat a').removeClass('active');
        });
        $(document).on('mouseleave', '.megabear', function () {
            $('body').removeClass('bearisangry dontbeangrybear chinupbear');
            $('.menufar a,.navCat a').removeClass('active');
        });
        $(document).on('click', function () {
            $('body').removeClass('bearisangry dontbeangrybear chinupbear');
            $('.menufar a,.navCat a').removeClass('active');
        });
        $(document).on('mouseenter', '.manybox a', function () {
            const img = $(this).data('img');
            if (img !== '') {
                $('body').addClass('chinupbear');
            }
            $(this).parent().parent().find('.manyboxpreview img').attr('src', img);
        });
        $(document).on('mouseleave', '.manybox a', function () {
            $('body').removeClass('chinupbear');
        });
        $(document).on('click', '.manybox a', function () {
            $(this).addClass('active');
            setTimeout(function () {
                $('body').removeClass('bearisangry dontbeangrybear chinupbear');
                $('.manybox a').removeClass('active');
            }, 200);
            $('.navCat a').removeClass('superactive');
            let parentNav = $(this).parent().data('nav');
            $('.navCat a').each(function () {
                if ($(this).html() == parentNav) {
                    $(this).addClass('superactive');
                }
            });
        });
        $(document).on('click', '.navMenubar', function () {
            $('body').addClass('bearisangry');
        });
        $(document).on('click', '.begabearcloser', function () {
            $('body').removeClass('bearisangry');
        });
        $(document).on('mouseenter', '.navSearch,.navBtns,.navLogoBase', function () {
            $('.navCat a').removeClass('active');
            $('body').removeClass('bearisangry dontbeangrybear chinupbear');
        });
        // $(document).on('click','.navCat a',function(){
        //     $('.navCat a').removeClass('superactive');
        //     $(this).addClass('superactive');
        //     $('body').removeClass('bearisangry dontbeangrybear chinupbear');
        // });
        $(document).on('click', '.search', function () {
            $(this).find('input').focus();
        });
        $(document).on('click', '.catpreviewfilterbox a', function () {
            $(this).parent().find('a').removeClass('active');
            $(this).addClass('active');
        });
        $(document).on('click', '.loginChecker', function () {
            self.checkLogin();
        });
        const cookies = new Cookies();
        let products = cookies.get('products');
        let cartcount = 0;
        if (products) {
            Object.values(products.products).map(function (item, i) {
                if (item !== null) {
                    cartcount++;
                }
            });
        }
        if (cartcount != 0) {
            $('.icon-cart').addClass('added');
            $('.icon-cart b').html(cartcount);
        }
        this.checkLogin();
    }

    Search() {
        if (!this.state.searchActive) {
            this.setState({'searchActive': true});
            $('.search input').val('');
            $('.search input').focus();
        } else {
            this.setState({'searchActive': false});
        }
    }

    UnSearch() {
        this.setState({'searchActive': false});
    }

    goSearch() {
        let encodeUrl = (str) => {
            return str.replace(/ /g, '-')
        };
        let query = this.state.query, sort = 'the-newest';
        let searchParams = new URLSearchParams(window.location.search);
        if (query != '') {
            this.setState({'searchActive': false});
            $('body').removeClass('wellcome');
            $('.navSearchResponsive input').val('').blur();
            if (searchParams.get('sort')) {
                sort = searchParams.get('sort')
            }
            Router.push({
                pathname: '/search/' + encodeUrl(query), query: {sort}
            });
            console.log('/search/' + encodeUrl(query), searchParams)
            // this.props.history.push('/search/'+encodeUrl(query));
        }
    }

    navCatOther() {
        if (this.state.moreShow) {
            this.setState({'moreShow': false});
        } else {
            this.setState({'moreShow': true});
        }
    }

    goBack() {
        window.history.back()
        // this.props.history.goBack();
    }

    searchFocus() {
        $('.navSearchResponsive input').focus();
    }

    static async getInitialProps({pathname}) {
        let state = await store.getState().root
        console.log(asd);
        return {state, pathname}
    }

    render() {
        const iprops = translate[this.props.locale]
        let self = this;
        let encodeUrl = (str) => {
            return str.replace(/ /g, '-')
        }
        let navMenu = [];
        let defaultappend = '';
        if (this.props.config && this.props.config.defaultsort) {
            defaultappend = '/?sort=' + this.props.config.defaultsort;
        }
        // let navMenu = Object.values(this.props.navMenu).map(function(item,i){return (<Link to={encodeUrl(`/categories/${item}`)} className={`animated slideInLeft${self.props.location.pathname=='/categories/'+encodeUrl(item) ? (' superactive') : ('')}`} key={i}><span className="animated fadeIn">{item}</span></Link>);});
        if (this.props.navList) {
            navMenu = [<a data-sex={Array(iprops.sex.women, 'زنان')} className={`animated slideInLeft`}
                          key={`sex-link-2`}><span
                className="animated fadeIn">{this.props.locale == 'fa' ? 'زنان' : iprops.sex.women}</span></a>,
                <a data-sex={Array(iprops.sex.men, 'مردان')} className={`animated slideInLeft`} key={`sex-link-1`}><span
                    className="animated fadeIn">{this.props.locale == 'fa' ? 'مردان' : iprops.sex.men}</span></a>,
                <a data-sex={Array(iprops.sex.children, iprops.sex.girl)} className={`animated slideInLeft`}
                   key={`sex-link-4`}><span
                    className="animated fadeIn">{this.props.locale == 'fa' ? 'دختران' : iprops.sex.girl}</span></a>,
                <a data-sex={Array(iprops.sex.children, iprops.sex.boy)} className={`animated slideInLeft`}
                   key={`sex-link-3`}><span
                    className="animated fadeIn">{this.props.locale == 'fa' ? 'پسران' : iprops.sex.boy}</span></a>];
            // navMenu=[<a data-sex={Array('مردانه','مردان','فارغ از جنسیت بزرگسالان')} className={`animated slideInLeft`} key={`sex-link-1`}><span className="animated fadeIn">مردان</span></a>,<a data-sex={Array('زنانه','زنان','فارغ از جنسیت بزرگسالان')} className={`animated slideInLeft`} key={`sex-link-2`}><span className="animated fadeIn">زنان</span></a>,<a data-sex={Array('پسرانه','فارغ از جنسیت کودکان','کودکانه')} className={`animated slideInLeft`} key={`sex-link-3`}><span className="animated fadeIn">پسران</span></a>,<a data-sex={Array('دخترانه','فارغ از جنسیت کودکان','کودکانه')} className={`animated slideInLeft`} key={`sex-link-4`}><span className="animated fadeIn">دختران</span></a>];
        }
        // let navMenu = ['مردان','زنان',''];
        // let products=cookies.get('products');
        // let cartcount=0;
        // if(products){
        // Object.values(products.products).map(function(item,i){
        // if(item!==null){
        // cartcount=cartcount+(1*item.count);
        // }
        // });
        // }
        return (<React.Fragment>
                {this.props.navList && (<>
                    <Megabear designers={this.props.designers} config={this.props.config} sex={this.state.sex}
                              navList={this.props.navList}/>
                    <Begabear locale={this.props.locale} navList={this.props.navList}/>
                </>)}
                <nav className={!this.props.navList ? 'inload' : ''}>
                    <div className="navLogoBase">
                        <Link href="/"><a className="navLogo noselect animated fadeIn"></a></Link>
                        <div className="navLogoLocale">
                            <div className="navLogoLocaleBar">
                                {this.props.locale == 'en' ? (<>
                                    <a className="active">EN</a>
                                    <a href="/">FA</a>
                                </>) : this.props.locale == 'fa' ? (<>
                                    <a className="active">FA</a>
                                    <a href="/en">EN</a>
                                </>) : (<>
                                    <a className="active">AR</a>
                                    <a href="/">FA</a>
                                    <a href="/en">EN</a>
                                </>)}
                            </div>
                            <div className="navLogoLocaleTri"></div>
                        </div>
                    </div>
                    <div className="navSearchResponsive" onClick={this.searchFocus}>
                        <div className="icon-search" onClick={this.goSearch}></div>
                        <input onChange={event => {
                            this.setState({query: event.target.value})
                        }} onKeyPress={event => {
                            if (event.key === 'Enter') {
                                this.goSearch()
                            }
                        }} type="text" placeholder={`${iprops.search} ...`}/></div>
                    <div className={`navCat${this.state.moreShow ? (' moreShow') : ('')}`}>
                        {/* <Link to="/categories" className={`animated slideInLeft nobear${self.props.location.pathname=='/categories' ? (' superactive') : ('')}`}><span className="animated fadeIn">جدیدترین ها</span></Link> */}
                        {navMenu}
                        <Link href="/designers"><a style={{cursor: 'pointer'}} data-sex={Array(iprops.designers)}
                                                   className={`animated slideInLeft navCatDesigners ${this.props.pathname == '/designers' ? (' superactive') : ('')}`}><span
                            className="animated fadeIn">{iprops.designers}</span></a></Link>
                        {this.props.config && this.props.config.gift_in_menu && this.props.config.gift_in_menu == 1 ? (
                            <Link href="/gift-cards"><a style={{cursor: 'pointer'}} data-sex={Array(iprops.giftcard)}
                                                        className="animated slideInLeft navCatGift"><span
                                className="animated fadeIn">{iprops.giftcard}</span></a></Link>) : null}
                        <Link href={`/categories/?discount=true${defaultappend.replace('/?', '&')}`}><a
                            style={{cursor: 'pointer', color: '#c77068'}} data-sex={Array(iprops.special)}
                            className="animated slideInLeft navCatVip"><span
                            className="animated fadeIn">{iprops.special}</span></a></Link>
                        <a className="navCatOther" onClick={this.navCatOther}>{iprops.other}</a>
                    </div>
                    <Navprof locale={this.props.locale} userName={this.state.userName} loggedIn={this.state.loggedIn}/>
                    <div className="navBtns">
                        <div data-tip={iprops.search}
                             className={`icon-nav icon-search${this.state.searchActive ? (' active') : ('')}`}
                             onClick={this.Search}></div>
                        <Link href="/dashboard/favorites"><a data-tip={iprops.favorites}
                                                             className="icon-nav icon-favorite"></a></Link><Link
                        href="/cart"><a data-tip={iprops.cart.title} className="icon-nav icon-cart"><b>0</b></a></Link>
                    </div>
                    <div className="navBack" onClick={this.goBack}></div>
                </nav>
                <div className={`search${this.state.searchActive ? (' active') : ('')}`}>
                    <input type="text" onChange={event => {
                        this.setState({query: event.target.value})
                    }} onKeyPress={event => {
                        if (event.key === 'Enter') {
                            this.goSearch()
                        }
                    }} placeholder={`${iprops.dosearch}...`}/>
                </div>
                <div className={`searchOverlay${this.state.searchActive ? (' active') : ('')}`}
                     onClick={this.UnSearch}></div>
            </React.Fragment>);
    }
}

export default connect(mapStateToProps)(Nav)

function mapStateToProps(state, ownProps) {
    return {
        state, designers: state.root.designers, navList: state.root.navList,
    }
}

const Navprof = (props) => {
    const iprops = translate[props.locale]
    if (props.loggedIn == false) {
        return (<Link href="/dashboard/login"><a className="navProf" data-tip={iprops.loginsignup}>
            <div className="icon-nav icon-user"></div>
            <span>{iprops.loginsignup}</span></a></Link>);
    } else {
        return (<Link href="/dashboard/profile"><a className="navProf" data-tip={props.userName}>
            <div className="icon-nav icon-user"></div>
            <span>{props.userName}</span></a></Link>);
    }
}