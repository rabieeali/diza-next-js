import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import $ from 'jquery';
import axios from 'axios';
import DbConfig from './DbConfig.js';
import {Helmet} from 'react-helmet';

export default class BlogSingle extends Component {
    constructor() {
        super();
        this.state = {
            sql: [], title: 'مجله'
        }
    }

    componentDidMount() {
        $('body').addClass('loading');
        axios.post('/:api:blog/' + this.props.match.params.url).then(response => {
            console.log(response);
            this.setState({sql: response.data});
            this.setState({title: response.data.title});
            $('header').addClass('littleenginegone');
            $('header').append('<img src="' + response.data.img + '" class="lilengineimg" draggable="false"><h2 class="lilengine theme-' + response.data.color + '">' + response.data.title + '</h2>');
            //$('header').html(response.data.title);
            $('body').removeClass('loading');
            if (response.data == '404') {
                $('header').removeClass('littleenginegone');
                $('.lilengine,.lilengineimg').remove();
            }
        }).catch(errors => {
            console.log(errors);
        });


        window.addEventListener('scroll', this.onScroll, false);
    }

    onScroll() {
        const scrollPos = $(window).scrollTop();
        $('.lilengineimg').css({transform: 'translateY(' + (scrollPos / 3) + 'px)'});
    }

    componentWillUnmount() {
        $('header').removeClass('littleenginegone');
        //$('lilengine').html('');
        $('.lilengine,.lilengineimg').remove();
        window.removeEventListener('scroll', this.onScroll, false);
    }

    render() {
        if (this.state.sql == '404') {
            return <Redirect to="/404"/>;
        }
        const nl2br = require('react-nl2br');
        return (
            <section className={`themebra theme-${this.state.sql.color}`}>
                <Helmet>
                    <title>{this.state.title + window.configMasterTitle}</title>
                    <link rel="canonical" href={window.location.href}/>
                    <meta name="description" content={this.state.sql.description}/>
                    <meta property="og:type" content="article"/>
                    <meta property="og:image" content={this.state.sql.img}/>
                    <meta property="og:title" content={this.state.title}/>
                    <meta property="og:description" content={this.state.sql.description}/>
                    <meta property="og:url" content={window.location.href}/>
                </Helmet>
                <div className="container-cafca line-baaz animated fadeIn slow delay-1s">
                    <span>hello</span>
                    {nl2br(this.state.sql.content)}
                    {/* Hello {this.props.match.params.url} */}
                </div>
            </section>
        );
    }
}