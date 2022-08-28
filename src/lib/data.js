import { API } from '../config'
import {postData} from '../lib/postData';
export const initAPI = async (locale) => {
    try{
        const call = await fetch(`${API}/init?locale=${locale}`)
        const response = await call.json()
        return {
          config:response.config,
          navList:response.navList,
          pages:response.pages,
          coupons:response.coupons,
          productsets:response.productsets,
          senser:response.senser,
          designers:response.designers,
          token:response.token
        }
      }catch(error){
        console.log('err',error);
        return {
          error:true,
          config:false,
        }
      } 
}
export const closeAPI = async (locale) => {
    try{
        const call = await postData(`init?locale=${locale}`,{},true)
        const response = await call
        return {
          senser:response.senser,
          coupons:response.coupons,
          productsets:response.productsets,
          lastvisits:response.lastvisits
        }
      }catch(error){
        console.log('err',error);
        return {
          error:true,
          config:false,
        }
      } 
}
export const getToken = async (locale) => {
    try{
        const call = await fetch(`${API}/laravelize`)
        const response = await call.json()
        return {
          token:response.token
        }
      }catch(error){
        console.log('err',error);
        return {
          error:true,
          config:false,
        }
      } 
}