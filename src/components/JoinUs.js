import React, { Component } from 'react';
import $ from 'jquery';
import {postData} from '../lib/postData';
import translate from '@/config/translate';
import ReCAPTCHA from "react-google-recaptcha";
const recaptchaRef = React.createRef();
const nl2br = require('react-nl2br');

export default class JoinUs extends Component {
    constructor(props){
        super(props);
        this.state={success:false,recaptcha:'',error:''}
        this.sendReq=this.sendReq.bind(this);
        this.recaptchaChanged=this.recaptchaChanged.bind(this);
    }
    sendReq(e){
    const iprops=translate[this.props.locale]
    let self=this;
    let btn=$(e.currentTarget);
    let name=$('.ju_name');
    let brand=$('.ju_brand');
    let phone=$('.ju_phone');
    let email=$('.ju_email');
    let experience=$('.ju_experience');
    let workplace=$('.ju_workplace');
    let instagram=$('.ju_instagram');
    let website=$('.ju_website');
    let introduction='-';
    let products = [];
    $('.ju_products:checked').each(function(){
        products.push($(this).val());
    });
    let description=$('.ju_description');
    btn.addClass('success');
    let somayenaro=false;
    if(name.val()==''){name.addClass('error');somayenaro=true;}
    if(brand.val()==''){brand.addClass('error');somayenaro=true;}
    if(phone.val()==''){phone.addClass('error');somayenaro=true;}
    if(email.val()==''){email.addClass('error');somayenaro=true;}
    if(experience.val()==''){experience.addClass('error');somayenaro=true;}
    if(workplace.val()==''){workplace.addClass('error');somayenaro=true;}
    if(instagram.val()==''){instagram.addClass('error');somayenaro=true;}
    // if(website.val()==''){website.addClass('error');somayenaro=true;}
    if(products.length==0){$('.checkinput').addClass('error');somayenaro=true;}
    if(description.val()==''){description.addClass('error');somayenaro=true;}
    if(somayenaro){
        setTimeout(function(){$('.error').removeClass('error');},1000);
        self.setState({'error':iprops.pleaseenterallitems+'.'});
        setTimeout(function(){
            self.setState({'error':''});
        },2500);
    }else if(this.state.recaptcha==''){
        self.setState({'error':iprops.pleasemarkthecaptcha+'.'});
        setTimeout(function(){
            self.setState({'error':''});
        },2500);
    }else{ 
        btn.addClass('pending');
        self.setState({'success':true});
        let updateData={recaptcha:self.state.recaptcha,name:name.val(),brand:brand.val(),phone:phone.val(),email:email.val(),experience:experience.val(),workplace:workplace.val(),instagram:instagram.val(),introduction:'-',website:website.val(),products:products,description:description.val()}
        postData('joinus',updateData).then((result)=>{
            if(result.status=='200'){
                $('.captcha-raw').addClass('hidden');
                $('.ju_name,.ju_brand,.ju_phone,.ju_email,.ju_experience,.ju_workplace,.ju_instagram,.ju_website,.ju_introduction,.ju_products,.ju_description').attr('disabled',true);
                self.setState({'success':true});
            }else{
                self.setState({recaptcha:'', error:iprops.captchahasexpired+'.'});
                recaptchaRef.current.reset();
                setTimeout(function(){
                self.setState({error:false});
                },2500);
            }
        });
     }
    }
    recaptchaLoaded(){
        $('.recaptcha-loading').remove();
    }
    recaptchaChanged(){
        const recaptchaValue = recaptchaRef.current.getValue();
        this.setState({recaptcha:recaptchaValue});
    }
    render(){
        const iprops=translate[this.props.locale]
        const self=this;
        return (<React.Fragment>
        <div className="designersportal">
            <h1 className="designersportalCenter">{iprops.joinus.h1}</h1>
        </div>
        <div className="container-cafca flex-1" style={{paddingTop:0}}>
            {/* <div className="titlebar">همکاری با دیزا</div> */}
            <div className="joinus">
                <div className="joinusrigh">
                    <div className="joinusrightop">
                    {nl2br(iprops.joinus.description)}.
                    </div>
                    <div className="joinusrighbottom">
                        <img alt="joinus icon 6" src="/img/joinus-6.svg"/>
                        <img alt="joinus icon 1" src="/img/joinus-1.svg"/>
                        <img alt="joinus icon 2" src="/img/joinus-2.svg"/>
                        <img alt="joinus icon 4" src="/img/joinus-4.svg"/>
                        <img alt="joinus icon 5" src="/img/joinus-5.svg"/>
                        <img alt="joinus icon 3" src="/img/joinus-3.svg"/>
                        <img alt="joinus icon 7" src="/img/joinus-7.svg"/>
                    </div>
                </div>
                <div className="joinuslef">
                    <div className="titlebar" style={{backgroundColor:'#fce4e0',textAlign:'right',padding:'10px 20px'}}>{iprops.joinus.collaborationform}</div>
                    <div className="joinuslefrow">
                        <div className="joinuslefcol"><div className="input"><input type="text" className="ju_name" placeholder={iprops.joinus.designername} /></div></div>
                        <div className="joinuslefcol"><div className="input"><input type="text" className="ju_brand" placeholder={iprops.joinus.brandname}/></div></div>
                        <div className="joinuslefcol"><div className="input"><input type="text" className="ju_phone" placeholder={iprops.joinus.mobilenumber}/></div></div>
                        <div className="joinuslefcol"><div className="input"><input type="text" className="ju_email" placeholder={iprops.joinus.email}/></div></div>
                        <div className="joinuslefcol"><div className="input"><select className="ju_experience"><option value="">{iprops.joinus.experience}</option><option>{iprops.joinus.underoneyear}</option><option>{iprops.joinus.onetotwoyears}</option><option>{iprops.joinus.twotofiveyears}</option><option>{iprops.joinus.morethanfiveyears}</option></select></div></div>
                        <div className="joinuslefcol"><div className="input"><input className="ju_workplace" type="text" placeholder={iprops.joinus.workplace}/></div></div>
                        <div className="joinuslefcol"><div className="input"><input type="text" className="ju_instagram" placeholder={iprops.joinus.instagrampageaddress}/></div></div>
                        <div className="joinuslefcol"><div className="input"><input type="text" className="ju_website" placeholder={iprops.joinus.websiteaddress}/></div></div>
                        {/* <div className="joinuslefcol"><div className="input"><select className="ju_introduction"><option value="">نحوه آشنایی</option><option>تبلیغات</option><option>گوگل</option><option>دوستان</option><option>سایر</option></select></div></div> */}
                        {/* <div className="joinuslefcol"><div className="input"><select className="ju_products" multiple><option value="" disabled>حوزه تولید</option><option>پوشاک</option><option>اکسسوری</option><option>کیف</option><option>کفش</option></select></div></div> */}
                        <div className="joinuslefcol joinuslefcol-100 joinuslefcol-flex">
                        <p>{iprops.joinus.whichcategory}</p>
                            <div className="checkinput">
                                <label className="filterinput">{iprops.joinus.clothing}<input type="checkbox" className="ju_products" name="ju_products[]" value={iprops.joinus.clothing}/><span className="checkmark"></span></label>
                                <label className="filterinput">{iprops.joinus.accessory}<input type="checkbox" className="ju_products" name="ju_products[]" value={iprops.joinus.accessory}/><span className="checkmark"></span></label>
                                <label className="filterinput">{iprops.joinus.bag}<input type="checkbox" className="ju_products" name="ju_products[]" value={iprops.joinus.bag}/><span className="checkmark"></span></label>
                                <label className="filterinput">{iprops.joinus.shoes}<input type="checkbox" className="ju_products" name="ju_products[]" value={iprops.joinus.shoes}/><span className="checkmark"></span></label>
                            </div>
                        </div>
                        <div className="joinuslefcol joinuslefcol-100"><div className="input"><textarea className="ju_description" placeholder={iprops.joinus.textarea}></textarea></div></div>
                        <div className="joinuslefcol joinuslefcol-100">
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
                        {this.state.error ? (<div className="alertMessage error mb-1 animated fadeIn">{this.state.error}</div>) : ('')}
                        <div className="btn" onClick={self.sendReq.bind(this)} style={{backgroundColor:'#fce4e0',border:'none',padding:'5px 10px',color:'#666'}}>{self.state.success ? iprops.joinus.success : iprops.joinus.send}</div>
                    </div>
                </div>
            </div>
        </div>
        </React.Fragment>);
        // return (<><div className="joinus">{elem}</div>);
    }
}