import React, { Component } from 'react';
import Link from 'next/link';
import $ from 'jquery';
import translate from '@/config/translate';

export default class Headere extends Component {
    constructor(props){
        super(props);
    }
    componentWillUnmount(){
        document.body.classList.remove('wellcome');
    }
    componentDidMount(){
        document.body.classList.add('wellcome');
        console.log('Diza | Cafelead.Agency All rights reserved. ©Dz');
        window.addEventListener('resize',this.reSized);
        this.reSized();
    }
    reSized(){
        let winWeed=$(window).width();
        if (winWeed >= 1000) {
            $('body.wellcome .headerCenter').insertAfter('.headerRight');
        }else{
            $('body.wellcome .headerCenter').insertAfter('.navCat');
        }
    }
    render() {
        const iprops=translate[this.props.locale]
        return (<React.Fragment>
            {this.props.config && (<div className="headerNew">
            <Link href={`/categories/${iprops.sex.women}?sort=${this.props.config.defaultsort}`}><a className="headerPart"><img alt={iprops.sex.women} src={this.props.config.indexHeaderImg2desktop}/><img alt={iprops.sex.women} src={this.props.config.indexHeaderImg2responsive}/><h2>{this.props.locale=='fa' ? <img alt={iprops.sex.women} src="/img/h2-2.svg"/> : iprops.sex.women}</h2></a></Link>
            <Link href={`/categories/${iprops.sex.men}?sort=${this.props.config.defaultsort}`}><a className="headerPart"><img alt={iprops.sex.men} src={this.props.config.indexHeaderImg1desktop}/><img alt={iprops.sex.men} src={this.props.config.indexHeaderImg1responsive}/><h2>{this.props.locale=='fa' ? <img alt={iprops.sex.men} src="/img/h2-1.svg"/> : iprops.sex.men}</h2></a></Link>
            <Link href={`/categories/${iprops.sex.children}?sort=${this.props.config.defaultsort}`}><a className="headerPart"><img alt={iprops.sex.children} src={this.props.config.indexHeaderImg3desktop}/><img alt={iprops.sex.children} src={this.props.config.indexHeaderImg3responsive}/><h2>{this.props.locale=='fa' ? <img alt={iprops.sex.children} src="/img/h2-3.svg"/> : iprops.sex.children}</h2></a></Link>
            </div>)}
        </React.Fragment>);
    }
}