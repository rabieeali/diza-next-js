import React, { Component } from 'react';
import $ from 'jquery';
export default class Standalone extends Component {
  constructor(props){
    super(props);
    this.state={navigator:false}
    this.closer=this.closer.bind(this);
  }
  componentDidMount(){
    const _iOSDevice = !!navigator.platform.match(/iPhone|iPod|iPad/);
    if(!window.navigator.standalone && _iOSDevice){
    // if(!window.navigator.standalone){
      this.setState({navigator:true});
    }
  }
  closer(){
    $('.standalone').addClass('standfadeout');
  }
  render(){
    if(this.state.navigator){
      return (<div className="standalone">
        <img alt="standalone" className="standalonelogo" src="/img/icon-192.png"/>
        <h3>وب اپلیکیشن <span>دیزا</span> را به Home screen موبایل خود اضافه کنید</h3>
        <div className="standalonecontent">
          <div className="standalonecontentparagraph">1 - در نوار پایین دکمه <img alt="share" src="/img/icon-standalone-share.svg"/> "Share" را انتخاب کنید.</div>
          <div className="standalonecontentparagraph">2 - منوی باز شده را به بالا بکشید و گزینه <img alt="add" src="/img/icon-standalone-add.svg"/> "Add to home screen" را انتخاب کنید.</div>
          <div className="standalonecontentparagraph">3 - در مرحله بعد در قسمت بالا روی Add کلیک کنید.</div>
          <div className="standalonecontentbutton" onClick={this.closer}>متوجه شدم</div>
        </div>
      </div>);
    }else{
      return ('');
    }
  }
}