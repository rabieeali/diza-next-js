import React, { Component, Fragment, useState, useEffect } from 'react';
import Link from 'next/link';
import $ from 'jquery';
import {postData} from '../lib/postData';
import * as moment from 'jalali-moment';
import Dictionary from './Dictionary';
import translate from '@/config/translate';

const nl2br = require('react-nl2br');
export class BlogSingle extends Component{
  constructor(props){
    super(props);
    this.state={isLogined:false,userData:'',userPhone:'',sql:'',blog:[],title:'...',userName:'مهمان'}
    this.getBlog=this.getBlog.bind(this);
    this.sendComment=this.sendComment.bind(this);
    this.likethis=this.likethis.bind(this);
  }
  componentDidMount(){
    $('body').removeClass('wellcome');
    if(this.props.blog){this.getBlog();}
    // axios.post('/:api:blog/'+this.props.match.params.url);
    if(localStorage.getItem('userData')){
      let userData=localStorage.getItem('userData');
      this.setState({'isLogined':true});
      this.setState({'userData':userData});
      this.setState({'userName':JSON.parse(userData).fullname});
      this.setState({'userPhone':JSON.parse(userData).userphone});
    }
  }
  componentDidUpdate(prevProps,prevState,snapshot){
    const {url,type} = this.props;
    if(prevProps.blog!=this.state.blog || (this.state.sql && this.state.sql.url!=url)){
      this.getBlog();
    }
  }
  getBlog(){
    let self=this;
    let blog=this.props.blog;
    const {url,type} = this.props;
    let sql='404';
    blog.forEach(function(item,i){
      if(url==item.url && type==item.type){
        sql=item;
        self.setState({title:item.title});
      }
    });
    self.setState({blog:this.props.blog,sql:sql});
  }
  shareOpen(e){
    $(e.currentTarget).toggleClass('active');
  }
  copyToClipboard(text){
    window.prompt("کپی در کلیپ بورد: ctrl+c، اینتر",text);
  }
  EnglishDigits(str){return str.replace(/([۰-۹])/g, token => String.fromCharCode(token.charCodeAt(0) - 1728));}
  toEnglishDigits(str){if(this.props.locale!='fa' && this.props.locale!='ar'){return str}var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];return str.replace(/[0-9]/g, function (w) {return id[+w];});}
  numberWithCommas(x){return this.toEnglishDigits(x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));}
  sendComment(){
    const iprops=translate[this.props.locale]
    let self=this;
    let scTitle=$('.scTitle').val();
    if(scTitle==''){scTitle=iprops.untitled;}
    let scContent=$('.scContent').val();
    if(scContent==''){$('.scContent').addClass('error');setTimeout(function(){$('.error').removeClass('error');},1000);}else{
        self.disabled=true;
        let updateData={title:scTitle,content:scContent,blogid:self.state.sql.id,userphone:self.state.userPhone,username:self.state.userName}
        $('.iproductcomment:nth-last-child(1) input,.iproductcomment:nth-last-child(1) textarea').attr('disabled',true);
        $('.iproductcomment:nth-last-child(1) input,.iproductcomment:nth-last-child(1) a').addClass('pending');
        postData('newblogcomment',updateData).then((result)=>{
          let scTime=self.props.locale=='fa' ? self.toEnglishDigits(moment().format('HH:mm jYYYY/jM/jD').toString()) : self.toEnglishDigits(moment().format('HH:mm YYYY/M/D').toString());
          $('.iproductcomment:nth-last-child(1)').before('<div class="iproductcomment animated slideInUp"><div class="iproductcommenthead"><h5>'+(self.state.userName=='مهمان' ? iprops.guest : self.state.userName)+'</h5><div class="ipchtime">'+scTime+'</div></div><p>'+scContent+'</p><p style="opacity:.6;">'+iprops.comment.sendsuccess+'.</p></div>');
          $('.iproductcomment:nth-last-child(1)').remove();
        });
    }
  }
  likethis(){
    let updateData={blogid:this.state.sql.id,userphone:this.state.userPhone}
    let lastdata=parseInt(this.EnglishDigits($('.blogsinglelike').html()));
    const self=this;
    postData('bloglike',updateData).then((result)=>{
      if(result.added===true){$('.blogsinglelike').html(self.toEnglishDigits((lastdata+1).toString()));$('.blogsinglelike').addClass('blogsingleliked');}else{$('.blogsinglelike').html(self.toEnglishDigits((lastdata-1).toString()));$('.blogsinglelike').removeClass('blogsingleliked');}
    });
  }
  render(){
    if(this.state.sql=='404'){this.props.redirect('/blog/categories')}
    const iprops=translate[this.props.locale]
    const {url,type} = this.props;
    if(this.state.sql){
    const self=this;
    let comments=Object.values(this.props.blogcomments).map(function(value,key){
      let updated_at=self.props.locale=='fa' ? self.toEnglishDigits(moment(value.created_at,'YYYY-M-D HH:mm').format('HH:mm jYYYY/jM/jD').toString()) : self.toEnglishDigits(moment(value.created_at,'YYYY-M-D HH:mm').format('HH:mm YYYY/M/D').toString());
      if(value.status==1 && value.blogid==self.state.sql.id){
      return(
          <div className="iproductcomment" key={key}>
              <div className="iproductcommenthead"><h5>{value.username}</h5><div className="ipchtime">{updated_at}</div></div>
              <p>{value.content}</p>
              {value.reply ? (<p style={{opacity:'.6'}}>{iprops.comment.dizasanswer}: {value.reply}</p>) : ('')}
          </div>
      );
      }
    });
    let likes=0;
    let userlike=false;
    this.props.bloglikes.forEach(function(likeitem,likekey){
      if(likeitem.blogid==self.state.sql.id){
        likes++;
        if(likeitem.phone==self.state.userPhone){userlike=true;}
      }
    });
    return (
      <section className="blog">
      {/* <Helmet>
        <title>{this.state.title+window.configMasterTitle}</title>
        <link rel="canonical" href={window.location.href} />
        <meta name="description" content={this.state.sql.description}/>
        <meta property="og:type" content={type} />
        <meta property="og:image" content={this.state.sql.img} />
        <meta property="og:title" content={this.state.title} />
        <meta property="og:description" content={this.state.sql.description} />
        <meta property="og:url" content={window.location.href} />
      </Helmet> */}
      <div className="container-cafca">
        <div className="blogsingle">
          <div className="blogsingleright">
            <div className="blogsingleimg"> 
            {type=='video' ? (<video controls poster={self.state.sql.img}><source src={self.state.sql.video} type="video/mp4"/></video>) : <img alt={this.state.sql.title} src={this.state.sql.img}/>}
            </div>
            {type=='podcast' ? (<audio controls><source src={self.state.sql.audio} type="audio/mpeg"/></audio>) : ('')}
            <div className="blogsingletitle">{this.state.title}</div>
            <div className="blogsinglebar"><span>{self.props.locale=='fa' ? self.toEnglishDigits(moment(self.state.sql.created_at,'YYYY-M-D HH:mm').format('jYYYY/jM/jD').toString()) : self.toEnglishDigits(moment(self.state.sql.created_at,'YYYY-M-D HH:mm').format('YYYY/M/D').toString())}</span><span style={{display:'none'}}>{iprops.views}: {self.toEnglishDigits(self.state.sql.views.toString())}</span><div className="blogsingleshare" onClick={this.shareOpen.bind(this)}><div className="blogsinglesharebox"><a className="blogsinglesharewhatsapp" href={`whatsapp://send?text=${window.location.href}`}></a><a className="blogsinglesharetelegram" href={`https://telegram.me/share/url?url=${window.location.href}`}></a><a className="blogsinglesharelink" onClick={()=>this.copyToClipboard(window.location.href)}></a></div></div><div onClick={self.state.userPhone && self.likethis} className={`blogsinglelike${!self.state.userPhone ? (' blogsinglenolike') : ('')}${userlike ? (' blogsingleliked') : ('')}`}>{self.toEnglishDigits(likes.toString())}</div></div>
            <div className="blogsinglecontent">{nl2br(Dictionary(this.state.sql.content,this.props.senser))}</div>
            <div className="iproductcomments animated slideInUp">
                {comments}
                <div className="iproductcomment animated slideInUp">
                <div className="ipchuser">
                  {iprops.comment.sendtextname1} {this.state.userName=='مهمان' ? iprops.guest : this.state.userName} {iprops.comment.sendtextname2}.
                </div>
                <div className="input"><textarea className="scContent" placeholder={`${iprops.comment.textarea}...`}></textarea></div>
                <div className="input"><a className="btn" onClick={this.sendComment}>{iprops.comment.send}</a></div>
                </div>
            </div>
          </div>
          <div className="blogsingleleft">
          <div className="blogsinglearticles">
          {self.props.blog && Object.values(self.props.blog).map(function(item,key){
          let itemCatArr=item.cat.split(',');
          let itemCatArrNew=[];
          let somayenaro=false;
          itemCatArr.forEach(function(catitem,catkey){
            Object.entries(self.props.blogcategories).map(function(blogcategoriesitem,blogcategorieskey){
              Object.values(blogcategoriesitem[1]).map(function(itemA,keyA){
                if(catitem==itemA.id && itemA.title!='همه'){itemCatArrNew.push(itemA.title);}
              });
            });
          });
          if(type!=item.type){somayenaro=true;}
          let itemDuration=item.duration;
          let itemDurationClass='';
          if(itemDuration.includes(':')){itemDuration=self.toEnglishDigits(itemDuration);itemDurationClass='icon-clock';}else{itemDuration=self.toEnglishDigits(itemDuration+' '+iprops.minutesstudy);}
          if(Array.from(itemCatArr,Number).includes(7)){somayenaro=true}
          if(!somayenaro){
          return(<Link href={`/blog/${item.type}/${item.url}`} key={`blogarticle-${key}`}><a className={`blogarticle blogarticle-${item.type}`}>
            <div className="blogarticleimg"><img alt={item.url} src={item.img}/><span className={itemDurationClass}>{itemDuration}</span></div>
            <div className="blogarticlebar"><span>{itemCatArrNew.join('، ')}</span><span style={{display:'none'}}>{iprops.views}: {self.toEnglishDigits(item.views.toString())}</span><span>{self.props.locale=='fa' ? self.toEnglishDigits(moment(item.created_at,'YYYY-M-D HH:mm').format('jYYYY/jM/jD').toString()) : self.toEnglishDigits(moment(item.created_at,'YYYY-M-D HH:mm').format('YYYY/M/D').toString())}</span></div>
            <div className="blogarticletitle">{item.title}</div>
          </a></Link>)
          }
        })}
          </div>
          </div>
        </div>
      </div>
      </section>
      )
    }else{
      return ('')
    }
  }
}
export class BlogCategorie extends Component{
  constructor(props){
    super(props);
    this.state={type:'',blog:[],sort:'newest'}
    this.filterByType=this.filterByType.bind(this);
    this.sortByHit=this.sortByHit.bind(this);
    this.sortByNewest=this.sortByNewest.bind(this);
    this.sortByValuable=this.sortByValuable.bind(this);
    this.getBlog=this.getBlog.bind(this);
  }
  componentDidMount(){
    $('body').removeClass('wellcome');
    if(this.props.blog){this.getBlog();}
  }
  componentDidUpdate(prevProps,prevState,snapshot){
    if(prevProps.blog!=this.state.blog){
      this.getBlog();
    }
  }
  getBlog(){
    let self=this;
    let blog=this.props.blog;
    blog.forEach(function(item,i){
      let likes=0;
      if(self.props.bloglikes){self.props.bloglikes.forEach(function(likeitem,likekey){
        if(likeitem.blogid==item.id){likes++;}
      });}
      blog[i].likes=likes;  
    });
    self.setState({blog:this.props.blog},()=>{
      const {url,id} = this.props;
      if(id){
        const elemtojump=$('#'+id);
        if(elemtojump.length!=0){
          elemtojump.addClass('active');
          setTimeout(function(){elemtojump.removeClass('active');},2000);
          $('html,body').animate({scrollTop:elemtojump.offset().top},500);
        }
      }
    });
    
  }
  filterByType(type){
    this.setState({type:type,sort:''});
  }
  sortByHit(){
    const {blog} = this.props;
    this.setState({type:'',sort:'hit',blog:blog.sort((a,b)=>b.views - a.views)});
  }
  sortByNewest(){
    const {blog} = this.props;
    this.setState({type:'',sort:'newest',blog:blog.sort((a,b)=>b.id - a.id)});
  }
  sortByValuable(){
    const {blog} = this.props;
    this.setState({type:'',sort:'valuable',blog:blog.sort((a,b)=>b.likes - a.likes)});
  }
  toEnglishDigits(str){if(this.props.locale!='fa' && this.props.locale!='ar'){return str}var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];return str.replace(/[0-9]/g, function (w) {return id[+w];});}
  numberWithCommas(x){return this.toEnglishDigits(x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));}
  render(){
  const self=this;
  const {url,id} = this.props;
  let se7en=false;
  let encodeUrl=(str)=>{return str.replace(/ /g,'-')}
  let decodeUrl=(str)=>{return str.replace(/-/g, ' ')}
  let title=false;
  let catid=0;
  if(self.props.blogcategories){Object.entries(self.props.blogcategories).map(function(item,key){
    Object.values(item[1]).map(function(itemA,keyA){
      if(itemA.url==url || (id && itemA.id==7)){
        title=itemA.title;
        catid=itemA.id;
        if(itemA.id==7){ se7en=true }
      }
    });
  });
  if(!title){self.props.redirect('/blog/categories')}
  }
  if(title==false){title='در حال پردازش';}
  let se7enData=[];
  if(self.state.blog && se7en){
      const blogitems = self.state.blog.filter(r => r.cat.toString().split(',').includes('7'))
      se7enData = Object.values(blogitems).reduce((r, e) => {
        let group = e.title[0];
        switch(group){
          case 'ا':
            group='الف';
            break;
          case 'ج':
            group='جیم';
            break;
          case 'د':
            group='دال';
            break;
          case 'ذ':
            group='ذال';
            break;
          case 'س':
            group='سین';
            break;
          case 'ش':
            group='شین';
            break;
          case 'ص':
            group='صاد';
            break;
          case 'ض':
            group='ضاد';
            break;
          case 'ط':
            group='طا';
            break;
          case 'ظ':
            group='ظا';
            break;
          case 'ع':
            group='عین';
            break;
          case 'غ':
            group='غین';
            break;
          case 'ق':
            group='قاف';
            break;
          case 'ک':
            group='کاف';
            break;
          case 'گ':
            group='گاف';
            break;
          case 'ل':
            group='لام';
            break;
          case 'م':
            group='میم';
            break;
          case 'ن':
            group='نون';
            break;
          case 'و':
            group='واو';
            break;
        }
        if(!r[group]) r[group] = {group, children: [e]}
        else r[group].children.push(e);
        return r;
      }, {})
      se7enData=Object.values(se7enData).sort( (a,b) => a.group.localeCompare(b.group) );
      // console.log(se7enData);
  }
  const iprops=translate[this.props.locale]
  // console.log(Object.values(se7enData));
  return (
      <section className="blog">
      {/* <Helmet>
          <title>{title+window.configMasterTitle}</title>
          <link rel="canonical" href={window.location.href} />
          <meta name="description" content={DbConfig.Blog[0].description}/>
          <meta property="og:title" content={DbConfig.Blog[0].title} />
          <meta property="og:description" content={DbConfig.Blog[0].description} />
          <meta property="og:url" content={window.location.href} />
      </Helmet> */}
      <h1 className="blogcategorietitle">{title}</h1>
      {!se7en ? (<div className="blogcategoriesbar">
      <div className="blogcategoriesfilter noselect"><Link href="/blog/categories"><a className="blogcategoriesfilterBack">{iprops.categories}</a></Link><b></b><span>{iprops.filterby} : </span><a className={self.state.sort=='newest' ? 'active' : ''} onClick={this.sortByNewest}>{iprops.sortByNewest}</a><a className={self.state.sort=='hit' ? 'active' : ''} onClick={this.sortByHit}>{iprops.sortByHit}</a><a className={self.state.type=='video' ? 'active' : ''} onClick={()=>this.filterByType('video')}>{iprops.video}</a><a onClick={()=>this.filterByType('podcast')} className={self.state.type=='podcast' ? 'active' : ''}>{iprops.podcast}</a><a onClick={()=>this.filterByType('article')} className={self.state.type=='article' ? 'active' : ''}>{iprops.article}</a></div>
      </div>) : ''}
      <div className="container-cafca">
        <div className="blogarticles">
        {se7enData ? Object.values(se7enData).map((item,key)=>{
          let itemchildren=[];
          item.children.map((se7enitem,se7enkey)=>{
            itemchildren.push(<div id={se7enitem.url} className="blogarticle blogarticle-full" key={`blogarticle-alpha-${se7enkey}`}><div className="blogarticletitle">{se7enitem.title}</div><div className="blogarticlecontent">{nl2br(se7enitem.content)}</div></div>)
          })
          return (<><div className="blogarticle_label" key={`blogarticle_label_${key}`}>{item.group}</div>{itemchildren}</>)
        }) : ''}
        {self.state.blog && Object.values(self.state.blog).map(function(item,key){
          let itemCatArr=item.cat.split(',');
          let itemCatArrNew=[];
          let somayenaro=true;
          itemCatArr.forEach(function(catitem,catkey){
            if(catitem==catid){somayenaro=false;}
            Object.entries(self.props.blogcategories).map(function(blogcategoriesitem,blogcategorieskey){
              Object.values(blogcategoriesitem[1]).map(function(itemA,keyA){
                if(catitem==itemA.id && itemA.title!=iprops.all){itemCatArrNew.push(itemA.title);}
              });
            });
          });
          if(!somayenaro && self.state.type!='' && item.type!=self.state.type){somayenaro=true;}
          let itemDuration=item.duration;
          let itemDurationClass='';
          if(itemDuration.includes(':')){itemDuration=self.toEnglishDigits(itemDuration);itemDurationClass='icon-clock';}else{itemDuration=self.toEnglishDigits(itemDuration+' '+iprops.minutesstudy);}
          if(se7en){ somayenaro=true }
          if(!somayenaro){
          return(<Link href={`/blog/${item.type}/${item.url}`} key={`blogarticle-${key}`}><a className={`blogarticle blogarticle-${item.type}`}>
            <div className="blogarticleimg"><img alt={item.url} src={item.img}/><span className={itemDurationClass}>{itemDuration}</span></div>
            <div className="blogarticlebar"><span>{itemCatArrNew.join('، ')}</span><span style={{display:'none'}}>{iprops.views}: {self.toEnglishDigits(item.views.toString())}</span><span>{self.props.locale=='fa' ? self.toEnglishDigits(moment(item.created_at,'YYYY-M-D HH:mm').format('jYYYY/jM/jD').toString()) : self.toEnglishDigits(moment(item.created_at,'YYYY-M-D HH:mm').format('YYYY/M/D').toString())}</span></div>
            <div className="blogarticletitle">{item.title}</div>
          </a></Link>)
          }
        })}
        </div>
      </div>
      </section>)
}
  
}
export class BlogCategories extends Component{
  constructor(props){
    super(props);
    this.state={
      isBlog:false
    }
  }
  componentDidMount(){
    $('body').removeClass('wellcome');
  }
  render(){
  const self=this;
  let encodeUrl=(str)=>{return str.replace(/ /g,'-')}
  let decodeUrl=(str)=>{return str.replace(/-/g, ' ')}
  return (
    <section className="blog">
    <div className="container-cafca">
    {self.props.blogcategories && Object.entries(self.props.blogcategories).map(function(item,key){
      return (<Fragment key={`dyeyeye-${key}`}>
        <div key={`blogcategoristitle`+key} className="blogcategoriestitle">{(item[0])}</div>
        <div className="blogcategories">{Object.values(item[1]).map(function(itemA,keyA){
          return (<Link key={`blogcategorie${keyA}`} href={`/blog/categories/${encodeUrl(itemA.url)}`}><a className="blogcategorie"><img draggable="false" src={itemA.img} alt={itemA.title}/><h4>{itemA.title}</h4></a></Link>)
        })}</div>
      </Fragment>)
    })}
    </div>
    </section>)
  }
}
export class Blog extends Component{
  constructor(props){
    super(props);
  }
  componentDidMount(){
    $('body').removeClass('wellcome');
  }
  render(){
    this.props.redirect('/blog/categories');
    return <span>w8</span>
  }
}