import { Component } from 'react';
import Link from 'next/link'
import translate from '@/config/translate';

export default class NoMatch extends Component{
    constructor(props){
        super(props);
        // this.goBack = this.goBack.bind(this);
    }
    // componentDidMount() {
    //     //document.title = '404';
    // }    
    // goBack(){
    //     this.props.history.goBack();
    // }
    render(){
    const iprops=translate[this.props.locale]
    return (<div className="noMatch">
        <h1>{this.props.config.nomatchTitle}.</h1>
        <Link href="/"><a className="btn">{iprops.home}</a></Link>
    </div>);
    }
}  