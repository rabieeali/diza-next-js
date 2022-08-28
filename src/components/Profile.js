import React, { Component } from 'react';
import $ from 'jquery';
import {postData} from '../lib/postData';

export default class Profile extends Component {
    constructor(props){
        super(props);
        this.state={
            box1editable:false,
            box2editable:false,
            fullname:'',
            email:'',
            postcode:'',
            country:'Iran',
            state:'',
            city:'',
            phone:'',
            address:''
        };
    }
    componentDidMount(){
        let userData=localStorage.getItem('userData');
        if(userData){
            userData=JSON.parse(userData);
            this.setState({address:userData.address,phone:userData.userphone,fullname:userData.fullname,email:userData.email,postcode:userData.postcode,country:userData.country,state:userData.state,city:userData.city});
        }
    }
    peyEdit(where) {
        if(where=='box2editable'){
            if(this.state.box2editable){
                const box2address=document.getElementById('box2address').value;
                const Fcountry=document.getElementById('Fcountry').value;
                const Fstate=document.getElementById('Fstate').value;
                const Fcity=document.getElementById('Fcity').value;
                const Fpostcode=document.getElementById('Fpostcode').value;
                this.setState({address:box2address,postcode:Fpostcode,country:Fcountry,state:Fstate,city:Fcity},()=>{this.userUpdate()});
            }
        }else if(where=='box1editable'){
            if(this.state.box1editable){
                const Ffullname=document.getElementById('Ffullname').value;
                const Femail=document.getElementById('Femail').value;
                this.setState({fullname:Ffullname,email:Femail},()=>{this.userUpdate()});
            }
        }
        this.setState({[where] : !this.state[where]})
    }
    userUpdate(){
        let localUserData=JSON.parse(localStorage['userData']);
        let updateData={state:this.state,userData:localUserData};
        postData('userUpdate',updateData).then((result)=>{
        if(result.status=='200'){
            localStorage.setItem('userData',JSON.stringify(result.userData));
        }
        });
    }
    inputBox(field){
        let userField=this.state[field];
        if(this.state.box1editable){
            if(field=='phone'){userField=<input disabled defaultValue={userField} id={`F${field}`} type="text"/>;}else{
                if(field=='fullname' || field=='email' || field=='phone'){userField=<input defaultValue={userField} id={`F${field}`} type="text"/>;}
            }
        }else{
            if(userField==null){userField='-'; }
        }
        if(this.state.box2editable){
            if(field=='postcode' || field=='country' || field=='state' || field=='city'){
                userField=<input defaultValue={userField} id={`F${field}`} type="text"/>;
            }
        }else{
            if(userField==null){userField='-'; }
        }
        return (userField);
    }
    render() {
        const iprops=this.props.iprops
        return (
            <React.Fragment>
            <div className="mainbox animated fadeIn">
                <div className="maintitle">{iprops.dashboard.personalinformation}</div>
                <div className="mainrow">
                    <div className="maincol">{iprops.firstnameandlastname} : {this.inputBox('fullname')}</div>
                    <div className="maincol">{iprops.phonenumber} : {this.inputBox('phone')}</div>
                    <div className="maincol">{iprops.dashboard.email} : {this.inputBox('email')}</div>
                </div>
                <div className="peyEdit" style={{ backgroundColor: this.state.box1editable ? '#a1b7a1': '#ddd'}} onClick={()=>this.peyEdit('box1editable')}>
                    {this.state.box1editable ? (iprops.dashboard.acceptandeditinformation) : (iprops.dashboard.editinformation)}
                </div>
            </div>
            <div className="mainbox fadeIn animated delay-1s"> 
                <div className="maintitle">{iprops.dashboard.postaladdress}</div>
                <div className="mainrow">
                <div className="maincol">{iprops.dashboard.postalcode} : {this.inputBox('postcode')}</div>
                <div className="maincol">{iprops.dashboard.country} : {this.inputBox('country')}<div className="input-break"></div>{iprops.dashboard.state} : {this.inputBox('state')}</div>
                <div className="maincol">{iprops.dashboard.city} : {this.inputBox('city')}</div>
                <div className="maincol">{iprops.dashboard.address}: {this.state.box2editable ? <textarea id="box2address" defaultValue={this.state.address}/> : this.state.address}</div>
                </div>
                <div className="peyEdit" style={{ backgroundColor: this.state.box2editable ? '#a1b7a1': '#ddd'}} onClick={()=>this.peyEdit('box2editable')}>
                {this.state.box2editable ? (iprops.dashboard.acceptandeditinformation) : (iprops.dashboard.editinformation)}
                </div>
                </div>
            </React.Fragment>
        );
    }
}