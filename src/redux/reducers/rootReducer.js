import * as types from '../types'

const initialState = {
    config: false,
    navList: [],
    navPoint: false,
    designers: [],
    locale: null,
    loading: false,
    error: null,
    dupadoua: false,
    coupons: [],
    pages: [],
    senser: [],
    productsets: [],
    lastvisits:[]    
}

const rootReducer = (state = initialState, action) => {
    switch(action.type){
        case types.GET_BLOG_CATEGORIES:
            return {
                ...state,
                posts:action.payload,
                loading:false,
                error: null
            }
        case types.LARAVELIZE:
            return {
                ...state,
                token:action.payload
            }
        case types.DUPADOUA:
            return {
                ...state,
                coupons:action.payload.coupons,
                senser:action.payload.senser,
                productsets:action.payload.productsets,
                lastvisits:action.payload.lastvisits,
                dupadoua:true
            }
        case types.INITIAL:
            // console.log(action.payload.config);
            return {
                ...state,
                locale:action.locale,
                config:action.payload.config,
                designers:action.payload.designers,
                coupons:action.payload.coupons,
                navList:action.payload.navList,
                productsets:action.payload.productsets,
                pages:action.payload.pages,
                senser:action.payload.senser,
                navPoint:action.payload.navPoint
            }
        default:
            return state
    }
}

export default rootReducer