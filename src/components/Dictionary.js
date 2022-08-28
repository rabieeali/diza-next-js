import React, {Component, useState, useEffect, useContext} from 'react';
// import MasterContext from '../contexts/MasterContext';

import $ from 'jquery';

const Dictionary = (string, senser) => {
    if (!senser) {
        return null
    }
    senser.map((sens) => {
        // console.log(sens);
        if (sens.title.includes(':')) {
            sens.title = sens.title.split(':')[0].trim();
        }
        string = string.replace(sens.title, '<a target="_blank" href="/dic/' + sens.url + '" title="' + sens.description + '" class="sense">' + sens.title + '</a>')
    })
    return <span dangerouslySetInnerHTML={{
        __html: string
    }}/>;
    return string
}
export default Dictionary