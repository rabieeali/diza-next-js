import React, { Component, useState, useEffect } from 'react';
// import { Link, Redirect} from 'react-router-dom';
// import Parser from 'html-react-parser';
import $ from 'jquery';
import {postData} from '../lib/postData';
import translate from '@/config/translate';
// import {postFetch} from '../lib/dataApi';

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            loginphone:'',
            logincode:'',
            changephonebtn:false,
            redirect:false,
            interval:0
        }
        this.doLogin=this.doLogin.bind(this);
        this.onChange=this.onChange.bind(this);
        this.changephone=this.changephone.bind(this);
        this.retrySms=this.retrySms.bind(this);
        this.loginGetCode=this.loginGetCode.bind(this);
    }
    componentDidMount(){
        this.props.checkLogin();
        $('.sidemenu').addClass('disabled');
        // $('#loginphone').focus();
        if(localStorage.getItem('userData')){
            this.setState({'redirect':true});
        }
    }
    componentWillUnmount(){
        $('.sidemenu').removeClass('disabled');
    }
    onChange(e){
    let self=this;
    this.setState({[e.target.name] : e.target.value});
    if(e.target.name=='loginphone'){
        if(e.target.value.length==11){
            e.target.disabled=true;
            this.setState({'loginphone': e.target.value},() => {
                this.loginGetCode();
            });
        }
    }
    if(e.target.name=='logincode'){
        if(e.target.value.length==4){
            setTimeout(function(){self.doLogin();},1000);
            $('#dologin').addClass('ready-to-login');
        }else{
            $('#dologin').removeClass('ready-to-login');
        }
    }
    }
    changephone(){
        this.setState({changephonebtn:false});
        document.getElementById('loginphone').value=null;
        document.getElementById('logincode').value=null;
        document.getElementById('loginphone').disabled=false;
        document.getElementById('loginphone').focus();
        document.getElementById('logincode').disabled=true;
    }
    doLogin(){
    if(this.state.logincode && this.state.loginphone){
        let tar=document.getElementById('logincode');
        $('.dologin').addClass('loading');
        tar.style.borderColor='white';
        postData('login',this.state).then((result)=>{
        if(result.status=='200'){
            let userData=JSON.stringify(result.userData);
            localStorage.setItem('userData',userData);
            this.setState({redirect:true});            
        }else{
            document.getElementById('logincode').value=null;
            tar.style.borderColor='red';
            setTimeout(function(){tar.style.borderColor='';},500);
        }
        });
        
    }
    }
    retrySms(){
        let self=this;
        if(this.state.interval!=0){
            this.setState({interval:this.state.interval+20});
        }else{
            this.loginGetCode();
        }
    }
    loginGetCode(){
        document.getElementById('logincode').disabled=false;
        document.getElementById('logincode').focus();
        postData('loginGetCode',this.state).then((result)=>{/*console.log(result);*/});
        this.setState({changephonebtn:true});
        const self=this;
        this.setState({interval:60});
        this.interval = setInterval(() => {if(this.state.interval==0){clearInterval(this.interval);}if(this.state.interval!=0){this.setState({ interval:this.state.interval-1 });}}, 1000);        
    }
    toEnglishDigits(str){if(this.props.locale!='fa' && this.props.locale!='ar'){return str}var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];return str.replace(/[0-9]/g, function (w) {return id[+w];});}
    numberWithCommas(x){return this.toEnglishDigits(x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));}
    render(){
        const self=this;
        if(this.state.redirect){
            // this.props.checkLogin();
            if(this.props.parent!='cart' && !this.props.tiny){
                this.props.redirect('/dashboard/list');
                // return (<Redirect to="/dashboard/list" />)
            }
        }

        // console.log(this.props.match.path);
        // if(this.props.match.path!='/cart'){
        //    alert('cc');
        // }
        const iprops=this.props.iprops ? this.props.iprops : translate[this.props.locale]
        const changephonebtn=this.state.changephonebtn;
        const retrySms=(<a className={`retrySms${this.state.interval!=0 ? (' disabled') : (' allowed')}`} onClick={this.retrySms}>{iprops.resendsecuritycode}{this.state.interval!=0 ? (' ('+this.toEnglishDigits(' '+this.state.interval)+' '+iprops.moreseconds+')') : ('')}</a>);        
        return (
            <div className="mainbox animated fadeIn">
                <div className="maintitle">{iprops.loginwithmobile}</div>
                <div className="loginform">
                    <div className="input">
                    <label>{iprops.mobilenumber}</label>
                    <input type="text" onChange={this.onChange} name="loginphone" id="loginphone" maxLength="11" placeholder="09127777777"/>
                    </div>
                    <div className="input">
                    <label>{iprops.securitycode}</label>
                    <input type="text" onChange={this.onChange} name="logincode" maxLength="4" id="logincode" disabled placeholder={iprops._securitycode}/>
                    </div>
                    <div className="input">
                    <label></label>
                    <button id="dologin" onClick={this.doLogin}>{iprops.loginsignup}</button>
                    </div>
                    
                    {changephonebtn ? (
                    <div className="input animated fadeIn slow">
                    <label></label>
                    <button className="changephonebtn" onClick={this.changephone}>{iprops.changemobilenumber}</button>
                    </div>
                    ) : ''
                    }
                </div>
                <div className="peyNevis">
                {changephonebtn &&
                <div style={{color:"green"}}>{iprops.loginsms1}{this.state.loginphone}{iprops.loginsms2}.{retrySms}</div>}
                    {iprops.logincomment}.
                </div>
            </div>
        )
    }
}