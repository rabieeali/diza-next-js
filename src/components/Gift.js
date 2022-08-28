import React, { Component } from 'react';
import Link from 'next/link'
import Login from './Login';
import moment from 'moment-jalaali';
import {postData} from '../lib/postData';
import $ from 'jquery';
import axios from 'axios';
import translate from '@/config/translate';
export default class Gift extends Component {
    constructor(props){
      super(props);
      this.state={giftdata:false,choosetype:false,type:'',step:0,redirect:false,giftamount:0,receivername:'',receiverphone:'',receivermessage:'',receiveraddress:'',giftreason:'',ownreceiver:false,giftdate:'',isLogined:false,i_phone:'',i_fullname:'',i_address:'',canchooseoffline:false};
      this.prevStep=this.prevStep.bind(this);
      this.nextStep=this.nextStep.bind(this);
      this.finalStep=this.finalStep.bind(this);
      this.checkLogin=this.checkLogin.bind(this);
      this.ownreceiver=this.ownreceiver.bind(this);
    }
    componentDidMount(){
      this.checkLogin();
      if((this.props.log=='success' && this.props.id) || (!this.props.log && this.props.id && this.props.id!='faild')){
        postData('gift',{orderid:this.props.id},true).then(response=>{
          console.log(response,'re')
          if(response=='404' || (!this.props.log && this.props.id && (response.status!='1' || response.type!='online'))){
            window.location='/gift/faild/'+this.props.id;
          }else{
              this.setState({giftdata:response});
          }
        });
      }
    }
    checkLogin(){
      const iprops=translate[this.props.locale]
      if(localStorage.getItem('userData')){
          this.setState({'isLogined':true},()=>{
              $('.navProf span,.navProfMobile span').html(iprops.userarea);
              $('.navProf,.navProfMobile').attr('href','/dashboard/profile');
              let userData=JSON.parse(localStorage.getItem('userData'));
              this.setState({userData:userData,i_address:userData.address,i_fullname:userData.fullname,i_phone:userData.userphone});
          });
      }else{
          this.setState({'isLogined':false},()=>{
              $('.navProf span,.navProfMobile span').html(iprops.loginsignup);
              $('.navProf,.navProfMobile').attr('href','/dashboard/login');
          });
      }
    }
    toPersianDigits(str){if(this.props.locale!='fa' && this.props.locale!='ar'){return str}var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];return str.replace(/[0-9]/g, function (w) {return id[+w];});}
    numberWithCommas(x){return this.toPersianDigits(x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));}
    prevStep(){
      if(this.state.step==1){
        this.setState({type:''});
      }
      this.setState({step:this.state.step-1});
    }
    nextStep(){
      let somayenaro=false;
      if(this.state.step==1 && this.state.type=='offline'){
        if(this.state.receivermessage==''){somayenaro=true;$('.giftpurchase-content-inner').addClass('error');}
        // if(this.state.giftreason==''){somayenaro=true;$('.giftpurchase-content-inner').addClass('error');}
      }else if(this.state.step==1 && this.state.type=='online'){
        if(this.state.receivermessage==''){somayenaro=true;$('.giftpurchase-content-inner').addClass('error');}
      }else if(this.state.step==2 && !this.state.isLogined){
        somayenaro=true;
      }else if(this.state.step==2 && this.state.type=='offline'){
        if(this.state.receivername=='' || this.state.receiverphone=='' || this.state.receiveraddress==''){somayenaro=true;$('.giftpurchase-content-inner:nth-child(1)').addClass('error');}
        if(this.state.giftdate==''){somayenaro=true;$('.giftpurchase-content-inner:nth-child(2)').addClass('error');}
      }else if(this.state.step==2 && this.state.type=='online'){
        if(this.state.receivername=='' || this.state.receiverphone==''){somayenaro=true;$('.giftpurchase-content-inner').addClass('error');}
      }
      if(!somayenaro){
        this.setState({step:this.state.step+1});
      }else{
        $('.giftpurchase-btn:nth-last-child(1)').addClass('error');
        setTimeout(()=>{$('.giftpurchase-content-inner,.mainbox,.giftpurchase-btn').removeClass('error');},1000);
      }
    }
    finalStep(){
      // go for payment
      let updateData={'type':this.state.type,'amount':this.state.giftamount,'receiverphone':this.state.receiverphone,'receivername':this.state.receivername,'receiveraddress':this.state.receiveraddress,'receivermessage':this.state.receivermessage,'giftreason':this.state.giftreason,'giftdate':this.state.giftdate,'userData':JSON.parse(localStorage.getItem('userData'))};
      postData('giftpurchase',updateData).then((result)=>{
          window.location=result.url;
      });
      this.setState({redirect:true});
    }
    ownreceiver(){
      if(this.state.ownreceiver){
        this.setState({ownreceiver:false,receiverphone:'',receivername:'',receiveraddress:''});
      }else{
        this.setState({ownreceiver:true,receivername:this.state.i_fullname,receiverphone:this.state.i_phone,receiveraddress:this.state.i_address});
      }
    }
    copy(e,text){
      let btn=$(e.currentTarget);
      btn.addClass('copied');
      setTimeout(()=>{btn.removeClass('copied');},1500);
      var input = document.createElement('textarea');
      input.innerHTML = text;
      document.body.appendChild(input);
      input.select();
      var result = document.execCommand('copy');
      document.body.removeChild(input);
      return result;
    }
    giftmula(cash,y=false){
      switch(this.props.locale){
        case 'en':
          cash='$ '+Math.floor(cash/this.props.config.USD)
          break;
        case 'ar':
          cash=Math.floor(cash/this.props.config.DR)+' درهم'
          break;
        case 'fa':
          cash+=' تومان'
          if(!y){cash+='ی'}
          break;
        default:
          return cash
      }
      return this.numberWithCommas(cash)
    }
    render(){
    const iprops=translate[this.props.locale]
    const self=this;
    const nl2br = require('react-nl2br');
    const giftcards = [
      {title:'کارت هدیه بیسیک',amount:500000,color:'pink'},
      {title:'کارت هدیه بیسیک پلاس',amount:1000000,color:'green'},
      {title:'کارت هدیه اولترا',amount:1500000,color:'pink'},
      {title:'کارت هدیه اولترا پلاس',amount:2000000,color:'green'}
    ];
    let postdatenum;
    let postdates=[];
    moment.locale('fa');
    for(postdatenum=1;postdatenum<7;postdatenum++){
      if(moment().add(postdatenum,'days').format('dddd')!='پنج‌شنبه' && moment().add(postdatenum,'days').format('dddd')!='جمعه'){
        postdates.push(moment().add(postdatenum,'days').format('dddd، jYYYY/jM/jD'));
      }
    }
    postdates=postdates.splice(0,3);
    if(!this.props.log && this.props.id && this.props.id!='faild'){
      if(this.state.giftdata){
        let giftcode=this.state.giftdata.couponcode;
        let giftcontent=this.state.giftdata.content;
        let ismine=false;
        if(this.state.userData && (this.state.giftdata.receiver_phone==this.state.userData.userphone || this.state.giftdata.sender_phone==this.state.userData.userphone)){ismine=true;}
        return (<>
            <div className="giftcards">
              {giftcards.map((gift,giftkey)=>{
              if(gift.amount==this.state.giftdata.amount){
                return (<div key={`giftcard--${giftkey}`} className={`giftcard giftcard-lonely giftcard-${gift.color}`}>
                  <div className="giftcard-header"><img alt="giftcard header" src="/img/giftcard-header.svg" /></div>
                  {/* <div className="giftcard-title">{gift.title}</div> */}
                  <div className="giftcard-amount">{self.giftmula(gift.amount)}</div>
                  <div className="giftcard-content">{giftcontent}</div>
                  {self.state.isLogined ? (<>{ismine ? (<div className="giftcard-code">
                    <span>{giftcode}</span>
                    <div className="giftcard-code-copy" onClick={(e)=>this.copy(e,giftcode)}>{iprops.copycode}</div>
                  </div>) : (<div className="giftcard-code giftcard-code-no">
                    <span>diza101010001</span>
                    <div className="giftcard-code-copy">{iprops.gift.thegiftcarddoesnotbelongtoyou}.</div>
                  </div>)}</>) : (<div className="giftcard-code giftcard-code-no">
                    <span>diza101010001</span>
                    <div className="giftcard-code-copy">{iprops.gift.todisplaythecodeyoumustfirstauthenticate}.</div>
                  </div>)}
                </div>);
              }
              })}
            </div>
            {self.state.isLogined ? '' : (<div className="giftpurchase-content giftcard-login"><Login checkLogin={this.checkLogin} parent="cart"/></div>)}
          </>);
      }else{
        return (<div className="giftcards">
        <div className="bigder bigder-success">
          <p style={{marginBottom:0}}>{iprops.receivingdata} ...</p>
        </div>
      </div>);
      }
    }else if(this.props.log || this.props.id=='faild'){
      if(this.props.log=='faild' || this.props.id=='faild'){
        return (<div className="giftcards">
          <div className="bigder bigder-error">
            <div className="bigder-icon"></div>
            <h5>{iprops.faildpurchase}</h5>
            <Link href="/"><a className="btn">{iprops.backtomainpage}</a></Link>
          </div>
        </div>);
      }else if(this.props.log=='success' && this.state.giftdata){
        if(this.state.giftdata.type=='offline'){
          return (<div className="giftcards">
            <div className="bigder bigder-success">
              <div className="bigder-icon"></div>
              <h5>{iprops.successpurchase}</h5>
              <p>{iprops.successpurchasetext1} <span>{this.state.giftdata.receive_date}</span> {iprops.successpurchasetext2}.</p>
              <Link href="/"><a className="btn">{iprops.backtomainpage}</a></Link>
            </div>
          </div>);
        }else{
        let giftcode=this.state.giftdata.couponcode;
        let giftlink='https://diza.gallery/gift/'+this.state.giftdata.orderid;
        let giftcontent=this.state.giftdata.content;
        return (<div className="giftcards">
            <div className="bigder-pro">
              <div className="bigder bigder-success">
                <div className="bigder-icon"></div>
                <h5>{iprops.successpurchase}</h5>
                <p>{iprops.successpurchasetext3}</p>
                <div className="bigder-code">
                  <span><a href={giftlink} target="_blank" rel="noreferrer">{giftlink}</a></span>
                  <div className="bigder-code-copy" onClick={(e)=>this.copy(e,giftlink)}>{iprops.copylink}</div>
                </div>
                <Link href="/"><a className="btn">{iprops.backtomainpage}</a></Link>
              </div>
              {giftcards.map((gift,giftkey)=>{
              if(gift.amount==this.state.giftdata.amount){
                return (<div key={`giftcard--${giftkey}`} className={`giftcard giftcard-${gift.color}`}>
                  <div className="giftcard-header"><img alt="giftcard header" src="/img/giftcard-header.svg" /></div>
                  {/* <div className="giftcard-title">{gift.title}</div> */}
                  <div className="giftcard-amount">{self.giftmula(gift.amount)}</div>
                  <div className="giftcard-content">{giftcontent}</div>
                  <div className="giftcard-code">
                    <span>{giftcode}</span>
                    <div className="giftcard-code-copy" onClick={(e)=>this.copy(e,giftcode)}>{iprops.copycode}</div>
                  </div>
                </div>);
              }
              })}
            </div>
          </div>);
        }
      }else if(this.props.log=='success' && !this.state.giftdata){
        return (<div className="giftcards">
          <div className="bigder bigder-success">
            <div className="bigder-icon"></div>
            <h5>{iprops.successpurchase}</h5>
            <p style={{marginBottom:0}}>{iprops.receivingdata} ...</p>
          </div>
        </div>);
      }
    }
    return (
      <React.Fragment>
      <div className="whereami inmobile">
        <a></a>
        <a></a>
        <Link href="/">{iprops.home}</Link>
        {this.state.type!='' ? (<a style={{cursor:'pointer'}} onClick={()=>this.setState({type:'',choosetype:false,step:0})}>{iprops.giftcard}</a>) : (<a>{iprops.giftcard}</a>)}
        {this.state.type=='online' ? (<a>{iprops.gift.digitalversion}</a>) : ''}
        {this.state.type=='offline' ? (<a>{iprops.gift.physicalversion}</a>) : ''}
      </div>
      {this.state.type=='' && (<section className="giftcards">
        {giftcards.map((gift,giftkey)=>{
          let canchooseoffline=false;
          if(self.props.offlinegifts){
            self.props.offlinegifts.map((offlinegift)=>{
              if(gift.amount==offlinegift.num){canchooseoffline=true;}
            });
          }
          return (<div key={`giftcard-${giftkey}`} className={`giftcard giftcard-${gift.color}`}>
            <div className="giftcard-header"><img alt="giftcard header" src="/img/giftcard-header.svg" /></div>
            {/* <div className="giftcard-title">{gift.title}</div> */}
            <div className="giftcard-amount">{self.giftmula(gift.amount)}</div>
            <div className="giftcard-btn" onClick={()=>this.setState({choosetype:true,canchooseoffline:canchooseoffline,giftamount:gift.amount})}>{iprops.gift.buygiftcard}</div>
          </div>);
        })}
      </section>)}
      {this.state.type!='' && (<section className={`giftpurchase giftpurchase-${this.state.step}${this.state.redirect ? ' giftpurchase-redirected' : ''}`}>
        <div className="giftpurchase-header">
          <div className="giftpurchase-header-step"><span>{iprops.gift.choiceoccasion}</span></div>
          <div className="giftpurchase-header-space"></div>
          <div className="giftpurchase-header-step"><span>{iprops.gift.specifications}</span></div>
          <div className="giftpurchase-header-space"></div>
          <div className="giftpurchase-header-step"><span>{iprops.gift.thepayment}</span></div>
        </div>
        <div className="giftpurchase-content">
        {this.state.step==1 && (<>
          {this.state.type=='offline' ? (<div className="giftpurchase-content-inner">
            {/* <h5>مناسبت کارت را انتخاب کنید.</h5>
            <select value={this.state.giftreason} onChange={(e)=>this.setState({giftreason:e.target.value})}>
              <option value="">انتخاب کنید</option>
              <option>تولد</option>
              <option>ممد</option>
              <option>مهدی</option>
            </select> */}
            <h5>{iprops.gift.completecontentofthecard}.</h5>
            <label>{iprops.gift.writeyourmessage}</label>
            <textarea placeholder="..." maxLength={40} onChange={(e)=>this.setState({receivermessage:e.target.value})} defaultValue={this.state.receivermessage}></textarea>
          </div>) : (<div className="giftpurchase-content-inner">
            <h5>{iprops.gift.completecontentofthecard}.</h5>
            <label>{iprops.gift.writeyourmessage}</label>
            <textarea placeholder="..." maxLength={40} onChange={(e)=>this.setState({receivermessage:e.target.value})} defaultValue={this.state.receivermessage}></textarea>
          </div>)}
        </>)}
        {this.state.step==2 && (<>
          {this.state.isLogined ? (<>
          {this.state.type=='offline' ? (<React.Fragment><div className="giftpurchase-content-inner">
            <h5>{iprops.gift.receiverspecifications}</h5>
            <div className="giftpurchase-content-inner-inputs">
              <div onClick={()=>this.ownreceiver()} className="giftpurchase-content-inner-input giftpurchase-content-inner-input-100 i-am-my-own-receiver">
                <div className={`custom-checkmark${this.state.ownreceiver ? ' active' : ''}`}></div>
                <span>{iprops.gift.iammyownreceiver}</span>
              </div>
              <div className="giftpurchase-content-inner-input">
                <label>{iprops.gift.firstnameandlastname}</label>
                <input type="text" onChange={(e)=>this.setState({receivername:e.target.value})} value={this.state.receivername} placeholder="..." />
              </div>
              <div className="giftpurchase-content-inner-input">
                <label>{iprops.gift.mobilenumber}</label>
                <input type="text" disabled={this.state.ownreceiver} onChange={(e)=>this.setState({receiverphone:e.target.value})} value={this.state.receiverphone} placeholder="..." />
              </div>
              <div className="giftpurchase-content-inner-input giftpurchase-content-inner-input-100">
                <label>{iprops.gift.completeaddress}</label>
                <textarea placeholder="..." maxLength={40} onChange={(e)=>this.setState({receiveraddress:e.target.value})} value={this.state.receiveraddress}></textarea>
              </div>
            </div>
          </div><div className="giftpurchase-content-inner giftpurchase-content-inner-full">
            <h5>{iprops.gift.shippingtime}</h5>
            <div className="giftpurchase-content-inner-radios">
              {postdates.map((postdate,postdatekey)=>{
                let postdateArr=postdate.split('، ');
                return (<div key={`gift-postdate-${postdatekey}`} onClick={(e)=>this.setState({giftdate:postdate})} className="giftpurchase-content-inner-radio">
                  <div className={`giftpurchase-content-inner-radio-checkbox${this.state.giftdate==postdate ? ' active' : ''}`}></div>
                  <div className="giftpurchase-content-inner-radio-label">
                  <span>{postdateArr[0]}</span>
                  <span>{postdateArr[1]}</span>
                  </div>
                </div>)
              })}
            </div>
          </div></React.Fragment>) : (<React.Fragment><div className="giftpurchase-content-inner">
            <h5>{iprops.gift.receiverspecifications}</h5>
            <div className="giftpurchase-content-inner-inputs">
              <div className="giftpurchase-content-inner-input">
                <label>{iprops.gift.firstnameandlastname}</label>
                <input type="text" onChange={(e)=>this.setState({receivername:e.target.value})} value={this.state.receivername} placeholder="..." />
              </div>
              <div className="giftpurchase-content-inner-input">
                <label>{iprops.gift.mobilenumber}</label>
                <input type="text" onChange={(e)=>this.setState({receiverphone:e.target.value.replace(/[^0-9]/g, '')})} value={this.state.receiverphone} placeholder="..." />
              </div>
            </div>
          </div><div className="giftpurchase-content-inner-alert"><b>{iprops.gift.attention}: </b>{iprops.gift.attentioncomment}</div></React.Fragment>)}
          </>) : (<Login checkLogin={this.checkLogin} parent="cart"/>)}
        </>)}
        {this.state.step==3 & !this.state.redirect ? (<div className="giftpurchase-content-inner">
          <div className="giftpurchase-content-inner-detail">
            <h5>{iprops.gift.orderspecifications}</h5>
            <div className="giftpurchase-content-inner-detail-field giftpurchase-content-inner-detail-field-1">{iprops.gift.cardamount}: <span>{self.giftmula(this.state.giftamount,true)}</span></div>
            <div className="giftpurchase-content-inner-detail-field giftpurchase-content-inner-detail-field-3">{iprops.gift.recipientsname}: <span>{this.state.receivername}</span></div>
            <div className="giftpurchase-content-inner-detail-field giftpurchase-content-inner-detail-field-2">{iprops.gift.cardtype}: <span>{this.state.type=='offline' ? iprops.gift.printed : iprops.gift.digital}</span></div>
            <div className="giftpurchase-content-inner-detail-field giftpurchase-content-inner-detail-field-4">{iprops.gift.mobilenumber}: <span>{this.state.receiverphone}</span></div>
            {this.state.type=='offline' ? <>
              <div className="giftpurchase-content-inner-detail-field giftpurchase-content-inner-detail-field-5">{iprops.gift.address}: <span>{this.state.receiveraddress}</span></div>
              <div className="giftpurchase-content-inner-detail-field giftpurchase-content-inner-detail-field-6">{iprops.gift.shippingtime}: <span>{this.state.giftdate}</span></div>
            </> : null}
          </div>
          <div className="giftpurchase-content-inner-detail-field giftpurchase-content-inner-detail-field-price">{iprops.gift.theamountpayable}: <span>{self.giftmula(this.state.giftamount,true)}</span></div>
        </div>) : null}
        {this.state.redirect && (<div className="giftpurchase-content-inner">
          <div className="loading-image"></div>
          <div className="loading-text">{iprops.transferringtothebank}...</div>
        </div>)}
        </div>
        <div className="giftpurchase-footer">
          <div className="giftpurchase-btn" onClick={()=>this.prevStep()}>{iprops.previousstep}</div>
          {this.state.step==3 ? (<div className="giftpurchase-btn giftpurchase-btn-normal" onClick={()=>this.finalStep()}>{iprops.gift.thepayment}</div>) : (<div className="giftpurchase-btn" onClick={()=>this.nextStep()}>{iprops.nextstep}</div>)}
        </div>
      </section>)}
      <div className={`gifttypemodal${this.state.choosetype ? ' active' : ''}`}>
        <div className="gifttypecloser" onClick={()=>this.setState({choosetype:false})}></div>
        <div className="gifttypeinner">
          <h5>{iprops.gift.selecttheversionyouwant}</h5>
          <div className="gifttypechooses">
            <div className="gifttypechoose" onClick={()=>this.setState({type:'online',choosetype:false,step:1})}>
              <span>{iprops.gift.digitalversion}</span>
              <p>{iprops.gift.digitalversioncomment}.</p>
            </div>
            <div className={`gifttypechoose${!this.state.canchooseoffline ? ' cantchooseoffline' : ''}`} onClick={()=>{if(this.state.canchooseoffline){this.setState({type:'offline',choosetype:false,step:1})}}}>
              <span>{iprops.gift.physicalversion}</span>
              <p>{iprops.gift.physicalversioncomment}.</p>
            </div>
          </div>
        </div>
      </div>
      </React.Fragment>
    );
    }
}  