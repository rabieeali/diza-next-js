import * as types from '../types'
import { initAPI, closeAPI, getToken } from '../../lib/data'

export const setInit = (locale,data=false) => async dispatch => {
    let init = data 
    if(!data){
        init = await initAPI(locale);
    }
    init['navPoint']=navPP(init['navList'])
    dispatch({
        type: types.INITIAL,
        payload: init,
        locale
    })
}

export const setDoua = (locale) => async dispatch => {
    const dup = await closeAPI(locale);
    dispatch({
        type: types.DUPADOUA,
        payload: dup,
        locale
    })
}

const navPP = navList => {
    return navList
}

export const laravelize = () => async dispatch => {
    const token = await getToken();
    dispatch({
        type: types.INITIAL,
        payload: token.token,
    })
}