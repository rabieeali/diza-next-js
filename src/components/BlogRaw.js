import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import axios from 'axios';
import DbConfig from './DbConfig.js';
import {Helmet} from 'react-helmet';

export default class BlogRaw extends Component{
    constructor(props){
      super(props);
      //console.log(super());
      this.state={
        blog:[],isBlog:false
      }
    }
    componentDidMount(){
      if(this.props.match.path=='/blog'){
        this.setState({isBlog:true});
      }
      axios.post('/:api:blog').then(response=>{
        this.setState({blog:response.data});
      }).catch(errors=>{console.log(errors);});
    }
    render(){
    return (
        <section className="articles">
        {this.state.isBlog &&
        <Helmet>
            <title>{DbConfig.Blog[0].title+window.configMasterTitle}</title>
            <link rel="canonical" href={window.location.href} />
            <meta name="description" content={DbConfig.Blog[0].description}/>
            <meta property="og:title" content={DbConfig.Blog[0].title} />
            <meta property="og:description" content={DbConfig.Blog[0].description} />
            <meta property="og:url" content={window.location.href} />
        </Helmet>
        }
        <div className="container-cafca">
        <div className="titlebar">دیزا بلاگ</div>
        <div className="lgarticles">
        {
          this.state.blog.map(
            (data,i) => <Link to={`/blog/${data.url}`} key={i} className={`lgarticle animated bounceInUp theme-${data.color}`}>
              <h5>{data.title}</h5>
              <img alt={data.title} src={data.img}/>
              </Link>
          )
        }
        </div>
        </div>
        </section>
    );
    }
  }  