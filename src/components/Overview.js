import React, { Component } from 'react';
import Link from 'next/link';
import $ from 'jquery';
import translate from '@/config/translate';
export default class Overview extends Component {
    constructor(props){
      super(props);
      this.state={
        navList:[{'id':4},{'id':5}],
      }
      this.overparent=this.overparent.bind(this);
      this.sexSelector=this.sexSelector.bind(this);
      this.headSelector=this.headSelector.bind(this);
      this.groupToggle=this.groupToggle.bind(this);
    }
    componentDidMount(){
      $('header,nav').addClass('minimize');
      if(this.props.navList!=this.state.navList){
        this.setState({'navList':this.props.navList});
      }
    }
    componentDidUpdate(prevProps,prevState,snapshot){
      if(prevProps.navList!=this.state.navList){
      this.setState({'navList':prevProps.navList});
      }
    }
    overparent(event){
      const key = event.currentTarget.dataset.key;
      if(!$('.over-'+key).hasClass('active')){
        event.stopPropagation();
        event.preventDefault();
        $('.overchilds').removeClass('active');
        $('.over-'+key).addClass('active');
        $('.over-'+key+' a').each(function(){
            if($(this).data('sex')!=''){
                $('.over-'+key).addClass('havefar');
            }
        });
      }else{
        $('.over-'+key).removeClass('active');
      }
    }
    sexSelector(event){
        let sex=event.currentTarget.innerText;
        Object.values(event.target.parentNode.children).map(function(item,i){
            if(item.dataset.sex && item.dataset.sex!=sex){item.classList.add('hidden');}
        });
        event.target.parentNode.classList.remove('havefar');
        // event.target.parentNode.classList.add('haventfar');
    }
    headSelector(e){
      let index=$(e.currentTarget).index();
      // console.log(index);
      $('.overviewHeader span,.overviewContent').removeClass('active');
      $('.overviewHeader span:nth-child('+(index+1)+')').addClass('active');
      $('.overviewContent:nth-child('+(index+1)+')').addClass('active');
    }
    groupToggle(e){
      let target=$(e.currentTarget).parent();
      if(target.hasClass('active')){
        $('.overviewContentGroup').removeClass('active');
      }else{
        $('.overviewContentGroup').removeClass('active');
        target.addClass('active');
      }
    }
    componentWillUnmount(){
        $('header,nav').removeClass('minimize');
    }
    render() {
      const iprops=translate[this.props.locale],props=this.props,{locale}=this.props
      let self=this;
      let defaultappend='';
      if(this.props.config && this.props.config.defaultsort){defaultappend='/?sort='+this.props.config.defaultsort;}
      let result=[];
      let key=0;
      let res,ult,keyE;
      let encodeUrl=(str)=>{return str.replace(/ /g,'-')}
      let decodeUrl=(str)=>{return str.replace(/-/g, ' ')}
      let Value=[];
      Value[iprops.sex.women]=[];
      Value[iprops.sex.men]=[];
      Value[iprops.sex.girl]=[];
      Value[iprops.sex.boy]=[];
      for (const [keyA, valueA] of Object.entries(props.navList)) {
          for (const [keyB, valueB] of Object.entries(valueA)) {
              if(keyA==iprops.sex.women){
                  Value[iprops.sex.women][keyB]=[];
              }
              if(keyA==iprops.sex.men){
                  Value[iprops.sex.men][keyB]=[];
              }
              if(keyA==iprops.sex.boy){
                  Value[iprops.sex.boy][keyB]=[];
              }
              if(keyA==iprops.sex.girl){
                  Value[iprops.sex.girl][keyB]=[];
              }
          }
      }
      for (const [keyA, valueA] of Object.entries(props.navList)) {
          for (const [keyB, valueB] of Object.entries(valueA)) {
              if(keyA==iprops.sex.men){
                  valueB.forEach(function(valueitem,i){
                      Value[iprops.sex.men][keyB].push(valueitem);
                  });
              }
              if(keyA==iprops.sex.women){
                  valueB.forEach(function(valueitem,i){
                      Value[iprops.sex.women][keyB].push(valueitem);
                  });
              }
              if(keyA==iprops.sex.boy){
                  valueB.forEach(function(valueitem,i){
                      Value[iprops.sex.boy][keyB].push(valueitem);
                  });
              }
              if(keyA==iprops.sex.girl){
                  valueB.forEach(function(valueitem,i){
                      Value[iprops.sex.girl][keyB].push(valueitem);
                  });
              }
          }
      }
      let overviewDesigners=[];
      if(overviewDesigners){
        // console.log(this.props.designers);
        overviewDesigners=Object.values(this.props.designers).map(function(valP,keyP){
        return (<Link key={`overviewContentGroupTitleLink-${keyP}`} href={`/@${valP.url}${defaultappend}`}><a className="overviewContentGroupTitleLink">{valP.name}</a></Link>);
        });
      }
      const overviewContent=Object.entries(Value).map(function(valP,keyP){
        // console.log(valP[0]);
        // console.log(valP[0]);
        let ult=[];
        for (const [keyB, valueB] of Object.entries(valP[1])){
          // console.log(keyB);
          let ultin=[];
          for (const [keyC, valueC] of Object.entries(valueB)){
            // console.log(valueC);
          ultin.push(<Link key={`catlink-${keyC}-${keyP}`} href={`/categories/${encodeUrl(valueC.sex)}/${encodeUrl(valueC.nav)}/${encodeUrl(valueC.title)}${defaultappend}`}>{valueC.title}</Link>);
          }
          ult.push(<div key={`overviewContentGroup7-${keyB}-${keyP}`} className="overviewContentGroup">
          <div className="overviewContentGroupTitle" onClick={self.groupToggle.bind(this)}>{keyB}</div>
          <div className="overviewContentGroupContents">
          <Link href={`/categories/${encodeUrl(valP[0])}/${encodeUrl(keyB)}/?discount=true${defaultappend.replace('/?','&')}`}><a style={{color:'rgb(140,22,44)'}}>{locale!='fa' && locale!='ar' ? iprops.discounted+' ' : ''}{keyB}{locale=='fa' || locale=='ar' ? ' '+iprops.discounted : ''}</a></Link>
          <Link href={`/categories/${encodeUrl(valP[0])}/${encodeUrl(keyB)}${defaultappend}`}>{iprops.all}</Link>
          {ultin}
          </div>
          </div>);
        }
        if(self.props.config && self.props.config.gift_in_menu && self.props.config.gift_in_menu==1){
        ult.push(<div className="overviewContentGroup" key={`overviewContentGroup--${keyP}`}><Link href="/gift-cards"><a className="overviewContentGroupTitle overviewContentGroupTitleLink" style={{borderBottom:'none'}}>{iprops.giftcard}</a></Link></div>);
        }
        let overviewactive='';
        if(keyP==0){overviewactive=' active';}else{overviewactive='';}
        return (<div key={`overviewContent`} className={`overviewContent${overviewactive}`}>{ult}</div>);

      });
        return (
            <div className="overview">
              <div className="overviewHeader">
                <span className="active" onClick={this.headSelector.bind(this)}><b>{iprops.sex.women}</b></span>
                <span onClick={this.headSelector.bind(this)}><b>{iprops.sex.men}</b></span>
                <span onClick={this.headSelector.bind(this)}><b>{iprops.sex.boy}</b></span>
                <span onClick={this.headSelector.bind(this)}><b>{iprops.sex.girl}</b></span>
                <span onClick={this.headSelector.bind(this)}><b>{iprops.designers}</b></span>
              </div>
              <div className="overviewContents">
              {overviewContent}
              <div className="overviewContent"><div className="overviewContentGroup">
              {overviewDesigners}
              </div></div>
              </div>
            </div>
        );
    }
  }