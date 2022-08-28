import React, { Component } from 'react';
import Link from 'next/link'
import { withRouter } from 'next/router'
import $ from 'jquery';
import translate from '@/config/translate';
export default withRouter(class Begabear extends Component {
    constructor(props){
        super(props);
        this.state = {
            loggedIn:false,
            categorieslist:false,
            categorieslistopen:false
        };
        this.checkLogin=this.checkLogin.bind(this);
        this.upper=this.upper.bind(this);
    }
    componentDidMount(){
        this.checkLogin();
        // $(document).on('click','.begabear a',function(){
        //     $('.begabear a').removeClass('active');
        //     $(this).addClass('active');
        // });
    }
    checkLogin() {
        if(localStorage.getItem('userData')){
            this.setState({'loggedIn':true});
        }else{
            this.setState({'loggedIn':false});
        }
    }
    upper(){
        $("html, body").animate({ scrollTop: 0 },300);
        // console.log();
    }
    render() {
        const iprops=translate[this.props.locale]
        const kuja=this.props.router.asPath
        return (
            <div className="begabear">
            <a className="mobileupper" onClick={this.upper}><div className="icon-upper"></div><span>{iprops.backtotop}</span></a>
            {/* <a className="blankBtn"></a> */}
            <Link href="/dashboard/list"><a className={kuja=='/dashboard/list' || kuja=='/dashboard' || kuja=='/dashboard/suggestion' || kuja=='/dashboard/favorites' || kuja=='/dashboard/grievance' || kuja=='/dashboard/profile' || kuja=='/dashboard/login' ? ('active') : ('')}><div className="icon-profile"></div><span>{iprops.dashboard.title}</span></a></Link>
            <Link href="/cart"><a className={kuja=='/cart' ? ('active') : ('')}><div className="icon-cart"><b>0</b></div><span>{iprops.cart.title}</span></a></Link>
            {/* <Link to="/dashboard/favorites"><div className="icon-kussher"></div><span>علاقه مندی</span></Link> */}
            <Link href="/overview"><a className={kuja=='/overview' ? ('active') : ('')}><div className="icon-cat"></div><span>{iprops._categories}</span></a></Link>
            <Link href="/"><a className={kuja=='/' ? ('active') : ('')}><div className="icon-home"></div><span>{iprops.home}</span></a></Link>
            </div>
        );
    }
});