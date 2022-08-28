import { server } from '../config'
import Axios from '../lib/axios'
import Cookies from 'universal-cookie';
const cookies = new Cookies();
export async function postData(type, userData, path=false, crsf=true){
    if(!path){path='restful/'}else{path='';}
    const baseUrl = server + '/:req:' + path;
    return new Promise((resolve,reject) => {
        try {
            const xsrf = cookies.get('XSRF-TOKEN');
            if(!xsrf || !crsf || typeof xsrf === 'undefined'){    
                // Axios.get(server+'/sanctum/csrf-cookie')
                setTimeout(function(){
                    Axios.post(supertrim(baseUrl+type),JSON.stringify(userData),{
                    headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json"}
                    },)
                    .then(res => resolve(res.data))
                    .catch(function(error){
                        bangerror(error)
                        console.log('wtf',error)
                    })
                },300)
            }else{
                Axios.post(supertrim(baseUrl+type),JSON.stringify(userData),{
                headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" }
                },)
                .then(res => resolve(res.data))
                .catch(function(error){
                    bangerror(error)
                    console.log('wtf',error)
                })
            }
        } catch (error) {
            reject(error);
        }
    })      
}   
export async function postFetch(type, userData, path=false){
    // let token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    if(!path){path='restful/'}else{path='';}
    const baseUrl = server + '/:req:' + path;
    return new Promise((resolve,reject) => {
        fetch(supertrim(baseUrl+type),{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text-plain, */*",
                "X-Requested-With": "XMLHttpRequest",
                // "X-CSRF-TOKEN": token
            },
            body: JSON.stringify(userData)
        }).then((response)=>response.json()).then((responseJson)=>{resolve(responseJson);}).catch((error)=>{reject(error);});
    })    
}   
function supertrim(site)     
{
    return site.replace(/\/$/, "");
} 
function bangerror(error){
    let reftime = 17
    setInterval(()=>{
        reftime-=1
        if(reftime==1){ location.reload(); }
        const message = `خطایی رخ داده! شرح: ${error}
        اگر میخواهید به بهبود دیزا کمک کنید این موضوع را به پشتیبانی دیزا اطلاع دهید.
        رفرش خودکار تا ${reftime} ثانیه دیگر ...`;
        $('nav').html(message);
    },1000)
}