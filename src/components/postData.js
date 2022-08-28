import { server } from '../config'
// import Axios from '../lib/axios'
// export function postData(type, userData){
//     const baseUrl=server+'/:api:restful/';
//     const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
//     // return new Promise((resolve,reject) => {
//     //     try {
//     //         const endpoint = baseUrl + '/api/register';
//     //         Axios.post(endpoint,JSON.stringify(userData),{
//     //             headers: { "Content-Type": "application/json", "Accept": "application/json, text-plain, */*", "X-Requested-With": "XMLHttpRequest", "X-CSRF-TOKEN": token }
//     //         },)
//     //         .then(res => resolve(res))
//     //     } catch (error) {
//     //         reject(error);
//     //     }
//     // })      
// }   

export function postData(type, userData){
    let baseUrl=server+'/:api:restful/';
    let token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    return new Promise((resolve,reject) => {
        fetch(baseUrl+type,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text-plain, */*",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": token
            },
            body: JSON.stringify(userData)
        }).then((response)=>response.json()).then((responseJson)=>{resolve(responseJson);}).catch((error)=>{reject(error);});
    })
}