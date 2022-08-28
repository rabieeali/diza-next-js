import React, { Component } from 'react';
import { Link,Redirect } from 'react-router-dom';
import $, { each } from 'jquery';
import axios from 'axios';
import Cookies from 'universal-cookie';
import * as moment from 'jalali-moment';
import {postData} from './postData';
import DbConfig from './DbConfig.js';
import Login from './Login';
import {Helmet} from 'react-helmet';
export default class ProductCustom extends Component {
    constructor(props){
      super(props);
      this.state={sql:[],count:0,isLogined:false,isSubscribe:false,showComments:false,notifStatus:'inventory',redirect:false,comments:[],productId:'',productColor:'',price:'',img:'',size:'',imgkey:0,title:'محصول',sizedetail:[],userData:false,NoticeMeInventory:false,showNotif:false,userName:'کاربر مهمان',userPhone:''}
    }
    componentDidMount(){
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
        let {productid,title} = this.props.match.params;
        let self=this;
        let color='default';
        axios.post('/:api:product/'+productid,{color:color,userphone:userphone,userid:userId}).then(response=>{
            this.setState({sql:response.data,title:response.data.title,img:response.data.img});
            this.setState({productId:productid,productColor:color});
            $('body').removeClass('loading');
        },error=>{self.setState({redirect:true});}).catch(errors=>{console.log(errors);});
    }
    componentWillUnmount(){
        $('header,nav').removeClass('minimize');
        $('.navCat a').removeClass('superactive');
    }
    render(){
      const self=this;
      let encodeUrl=(str)=>{return str.replace(/ /g,'-')}
    //   let title=this.state.title;
      let {productid,title} = this.props.match.params;
      return(<React.Fragment>
        <div className="iproduct">
            <Helmet>
                <title>{this.state.title+window.configMasterTitle}</title>
                <link rel="canonical" href={window.location.href} />
                <meta name="description" content={this.state.sql.description}/>
                <meta property="og:title" content={this.state.title} />
                <meta property="og:description" content={this.state.sql.description} />
                <meta property="og:url" content={window.location.href} />
            </Helmet>
            <div className="whereami inmobile">
            {this.state.sql ? (<React.Fragment>
                <a></a>
                <Link to="/">صفحه نخست</Link>
                {/* <Link>فارغ از جنسیت</Link> */}
                {this.state.sql.catSex && <Link to={encodeUrl(`/categories/${this.state.sql.catSex}`)}>{this.state.sql.catSex}</Link>}
                {this.state.sql.catNav && <Link to={encodeUrl(`/categories/${this.state.sql.catSex}/${this.state.sql.catNav}`)}>{this.state.sql.catNav}</Link>}
                {/* {this.state.sql.catParent && <Link to={`/categories/${this.state.sql.catNav}/${this.state.sql.catParent}`}>{this.state.sql.catParent}</Link>} */}
                {this.state.sql.catTitle && <Link to={encodeUrl(`/categories/${this.state.sql.catSex}/${this.state.sql.catNav}/${this.state.sql.catTitle}`)}>{this.state.sql.catTitle}</Link>}
            </React.Fragment>) : ('')}
            <Link to={encodeUrl(`/product-${productid}/${title}`)}>{this.state.sql.title}</Link>
            <a>سفارش دوخت</a>
            <a></a>
            </div>
        </div>
      </React.Fragment>)
    }
  }