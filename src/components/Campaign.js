import React, {Component} from 'react';
import Link from 'next/link'
import $ from 'jquery';
import ReactTooltip from 'react-tooltip';
import {assign} from 'lodash';


export default class Campaign extends Component {
    constructor(props) {
        super(props);
        this.state = {designers: []}
    }

    componentDidMount() {
        $('body').addClass('standalone-deactive');
        $('header,nav').addClass('minimize');
    }

    componentWillUnmount() {
        $('body').removeClass('standalone-deactive');
        $('header,nav').removeClass('minimize');
    }

    scrollBottom() {
        $([document.documentElement, document.body]).animate({scrollTop: $(".campaignsquares").offset().top - 5}, 200);
    }

    render() {
        let self = this;
        let designers;
        let keynum = 0;
        return (<React.Fragment>
            <section className="bigheader">
                <h1>طرح بااصالت مهمه!</h1>
                <h2>خرید پوشاک طراحان ایرانی</h2>
                <div className="bigheaderscroll" onClick={self.scrollBottom}></div>
            </section>
            <section className="campaignsquares">
                <Link href="/categories/مردانه/پوشاک?sort=the-newest"><a className="campaignsquare greensquare"><h2><img
                    alt="campaign title 1" src="/images/campaign-title-1.svg"/></h2><img alt="پوشاک آقایان"
                                                                                         src="/images/campaign-1.svg?new"/></a></Link>
                <Link href="/categories/زنانه/پوشاک?sort=the-newest"><a className="campaignsquare"><h2><img
                    alt="campaign title 2" src="/images/campaign-title-5.svg"/></h2><img alt="پوشاک خانم‌ها"
                                                                                         src="/images/campaign-3.svg?new"/></a></Link>
                <Link href="/categories/زنانه/کیف-و-کفش?sort=the-newest"><a className="campaignsquare"><h2><img
                    alt="campaign title 3" src="/images/campaign-title-4.svg"/></h2><img alt="کیف و کفش خانم‌ها"
                                                                                         src="/images/campaign-2.svg?new"/></a></Link>
                <Link href="/categories/مردانه/کیف-و-کفش?sort=the-newest"><a className="campaignsquare greensquare"><h2>
                    <img alt="campaign title 4" src="/images/campaign-title-3.svg"/></h2><img alt="کیف و کفش آقایان"
                                                                                              src="/images/campaign-6.svg?new"/></a></Link>
                <Link href="/categories/مردانه/اکسسوری?sort=the-newest"><a className="campaignsquare greensquare"><h2>
                    <img alt="campaign title 5" src="/images/campaign-title-6.svg"/></h2><img alt="اکسسوری آقایان"
                                                                                              src="/images/campaign-5.svg?new"/></a></Link>
                <Link href="/categories/زنانه/اکسسوری?sort=the-newest"><a className="campaignsquare"><h2><img
                    alt="campaign title 6" src="/images/campaign-title-2.svg"/></h2><img alt="اکسسوری خانم‌ها"
                                                                                         src="/images/campaign-4.svg?new"/></a></Link>
            </section>
        </React.Fragment>)
    }
}