import React, { Component } from 'react';
import $ from 'jquery';
import ReCAPTCHA from "react-google-recaptcha";
import {postData} from '../lib/postData';
import translate from '@/config/translate';
const recaptchaRef = React.createRef();

export default class Contact extends Component {
    constructor(props){
      super(props);
      this.state={name:null,phone:null,content:null,recaptcha:'',success:false,error:false}
      this.sendContact=this.sendContact.bind(this);
      this.recaptchaChanged=this.recaptchaChanged.bind(this);
    }
    sendContact(e){
      const iprops=translate[this.props.locale]
      let self=this;
      let btn=$(e.currentTarget);
      if(!this.state.name || !this.state.phone || !this.state.content || this.state.recaptcha==''){
        let errortext=iprops.pleaseenterallitems+'.';
        if(this.state.recaptcha==''){errortext=iprops.pleasemarkthecaptcha+'.';}
        self.setState({'error':errortext},()=>{setTimeout(function(){self.setState({'error':false})},2000)});
      }else{
        let updateData={locale:this.props.locale,content:this.state.content,name:this.state.name,phone:this.state.phone,recaptcha:self.state.recaptcha};
        btn.addClass('pending');
        postData('contact',updateData).then((result)=>{
          if(result.status=='200'){
            $('.captcha-raw').addClass('hidden');
            $('.contactform input,.contactform textarea,.contactform button').attr('disabled',true);
            self.setState({'success':true});
          }else{
            btn.removeClass('pending');
            self.setState({recaptcha:'', error:iprops.captchahasexpired+'.'});
            recaptchaRef.current.reset();
            setTimeout(function(){
              self.setState({error:false});
            },2500);
          }
        });
      }
      
      
    }
    // onChange(value) {
    //   console.log("Captcha value:", value);
    // }
    recaptchaLoaded(){
      $('.recaptcha-loading').remove();
    }
    recaptchaChanged(){
      const recaptchaValue = recaptchaRef.current.getValue();
      this.setState({recaptcha:recaptchaValue});
    }
    toEnglishDigits(str) {

      // convert persian digits [۰۱۲۳۴۵۶۷۸۹]
      var e = '۰'.charCodeAt(0);
      str = str.replace(/[۰-۹]/g, function(t) {
          return t.charCodeAt(0) - e;
      });
  
      // convert arabic indic digits [٠١٢٣٤٥٦٧٨٩]
      e = '٠'.charCodeAt(0);
      str = str.replace(/[٠-٩]/g, function(t) {
          return t.charCodeAt(0) - e;
      });
      return str;
    }
    render(){
    let self=this;
    const iprops=translate[this.props.locale]
    return (
      <div className="container-cafca">
      <div className="contact">
        <div className="contactinfo">
        
  
        <div className="contactrow">
          <div className="contactrowicon icon-call"></div>
          <div className="contactrowtext">
          <span>{iprops.phonenumber}</span>
          <a className="ltr" style={{color:'#333'}} href={`tel:${this.props.locale=='fa' ? '021' : ''}${this.props.config ? self.toEnglishDigits(this.props.config.phone) : ''}`}>{this.props.locale=='fa' ? '(۰۲۱) - ' : ''}{this.props.config && this.props.config.phone}</a>
          </div>
        </div>
  
  
        <div className="contactrow">
          <div className="contactrowicon icon-email"></div>
          <div className="contactrowtext">
          <span>{iprops.email}</span>
          <span>{this.props.config && this.props.config.email}</span>
          </div>
        </div>
  
        <div className="contactrow">
        <div className="contactsocials">
          {this.props.config && (<React.Fragment>
            {this.props.config.instagramUrl && <a href={this.props.config.instagramUrl} className="icon-instagram"></a>}
            {this.props.config.whatsappUrl && <a href={this.props.config.whatsappUrl} className="icon-whatsapp"></a>}
            {this.props.config.telegramUrl && <a href={this.props.config.telegramUrl} className="icon-telegram"></a>}
            {this.props.config.twitterUrl && <a href={this.props.config.twitterUrl} className="icon-twitter"></a>}
          </React.Fragment>)}
        </div>
        </div>
  
        
        </div>
        <div className="contactform">
        <div className="titlebar">{this.props.config.contactTitle}</div>
          <div className="contactp">{iprops.contactcomment}.</div>
          <div className="contactresult">
          {this.state.error ? (<div className="alertMessage error mb-1 animated fadeIn">{this.state.error}</div>) : ('')}
          {this.state.success ? (<div className="alertMessage success mb-1 animated fadeIn">{iprops.contactsuccess}.</div>) : ('')}
          </div>
          <div className="input"><input type="text" onChange={event => {this.setState({name: event.target.value})}} placeholder={iprops.firstnameandlastname}/></div>
          <div className="input"><input type="text" onChange={event => {this.setState({phone: event.target.value})}} placeholder={iprops.mobilenumber}/></div>
          <div className="input"><textarea className="w-100" onChange={event => {this.setState({content: event.target.value})}} placeholder={`${iprops.writeyourmessage}...`}></textarea></div>
          
          <div className="input input-100 captcha-raw">
            
          <div className="recaptcha-loading">{iprops.loading} ...</div>

          <ReCAPTCHA
            className="recaptcha"
            sitekey="6LcZ6d0aAAAAAI8_0cMws9VsIiGq23MLJQpNxmKY"
            asyncScriptOnLoad={this.recaptchaLoaded}
            onChange={this.recaptchaChanged}
            ref={recaptchaRef}
            hl={this.props.locale}
          />

          </div>

          <div className="input"><button className="mx-0 my-0" onClick={this.sendContact}>{iprops.sendmessage}</button></div>
        </div>
      </div>
      </div>
    );
    }
}