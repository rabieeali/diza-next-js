import { server } from '../config'
import Cookies from 'universal-cookie';

export async function postFetch(type, userData){
    // let token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const baseUrl=server+'/:api:restful/';
    const cookies = new Cookies();
    const token = cookies.get('XSRF-TOKEN');
    return new Promise((resolve,reject) => {
        fetch(baseUrl+type,{
            method: 'POST',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text-plain, */*",
                // "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": token
            },
            body: JSON.stringify(userData)
        }).then((response)=>response.json()).then((responseJson)=>{resolve(responseJson);}).catch((error)=>{reject(error);});
    })    
}
export async function getFetch(path,sony=false){
    // let token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    return new Promise((resolve,reject) => {
        fetch(server+path,{
            credentials: "include",
            method: 'GET',
            // headers: {
            //     "Content-Type": "application/json",
            //     "Accept": "application/json, text-plain, */*",
            //     "X-Requested-With": "XMLHttpRequest",
            //     // "X-CSRF-TOKEN": token
            // },
            // body: JSON.stringify(userData)
        }).then((response)=>{
            console.log(response,'yeyo');
            resolve(response);
        }).catch((error)=>{reject(error);});
    })    
}   