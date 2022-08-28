import React, { Component } from 'react';
import DbConfig from './DbConfig.js';
import {Helmet} from 'react-helmet';
export default class Receipts extends Component {
  constructor(props){
    super(props);
    this.state={status:'در حال بررسی',code:''}
    this.doRes=this.doRes.bind(this);
    this.ReRes=this.ReRes.bind(this);
  }
  componentDidMount(){
    let code=this.props.match.params.id;
    let input=document.getElementById('rescode');
    if(code!='' && typeof code!=='undefined'){
      this.setState({'code':code});
      input.value=code;
      input.disabled=true;
    }
  }
  doRes(){
    let self=this;
    let code=document.getElementById('rescode').value;
    if(code!=''){
    document.getElementById('rescode').disabled=true;
    self.setState({'code':code},()=>{
      self.props.history.push('/receipts/'+code);
    });
    }
  }
  ReRes(){
    let self=this;
    document.getElementById('rescode').value='';
    document.getElementById('rescode').disabled=false;
    document.getElementById('rescode').focus();
    self.setState({'code':''},()=>{
      self.props.history.push('/receipts');
    });
  }
  render(){
    return (<React.Fragment>
    <Helmet>
        <title>{DbConfig.Receipts[0].title+window.configMasterTitle}</title>
        <link rel="canonical" href={window.location.href} />
        <meta name="description" content={DbConfig.Receipts[0].description}/>
        <meta property="og:title" content={DbConfig.Receipts[0].title} />
        <meta property="og:description" content={DbConfig.Receipts[0].description} />
    </Helmet>
    <div className="container-cafca flex-1">
    <div className="titlebar">پیگیری سفارش</div>
    <div className="tinyform">
      <div className="input"><label>کد پیگیری</label><input type="text" name="rescode" id="rescode" placeholder="کد پیگیری"/></div>
      {this.state.code=='' ? (<div className="input"><label></label><button className="mx-0 my-0" onClick={this.doRes} id="dores">بررسی وضعیت</button></div>) : (<div className="input"><label></label><button className="mx-0 my-0" onClick={this.ReRes} id="reres">تغییر کد</button></div>)}
    </div>
    {this.state.code!='' &&
    <div className="tinyformstatus">وضعیت سفارش: <span>{this.state.status}</span></div>}
    </div>
    </React.Fragment>);
  }
}