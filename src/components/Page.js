import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';
const nl2br = require('react-nl2br');

export default class Page extends Component{
    constructor(props){
      super(props);
      this.state={
        sql:[],title:'صفحه',url:this.props.url
      }
      this.getPage = this.getPage.bind(this);
    }
    componentDidMount(){
        this.getPage();
    }
    componentDidUpdate(){
        const Matchurl = this.props.url;
        if(this.state.url!=Matchurl){
            this.getPage();
            this.setState({'url':Matchurl});     
        }
    }
    getPage(){
        $('body').addClass('loading');
        this.setState({sql:this.props.sql,title:this.props.sql.title},()=>{$('body').removeClass('loading');})
    }
    render(){
    return (
        <section>
        <div className="container-cafca line-baaz animated fadeIn slow delay-1s">
        <div className="titlebar">{this.state.title}</div>
        {nl2br(this.state.sql.content)}
        </div>
        </section>
    );
    }
  }  