import React from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link'
import translate from '@/config/translate';

const Megabear = (props) => {
    const router = useRouter()
    const {locale} = router
    const iprops=translate[locale]
    let defaultappend = '', sort;
    if(props.config && props.config.defaultsort){sort=props.config.defaultsort}
    if(router.query.sort){sort=router.query.sort}
    defaultappend='/?sort='+sort
    const menudesigners = () => {
        let result=[];
        let key=0;
        let res,ult,keyE;
        let encodeUrl=(str)=>{return str.replace(/ /g,'-')}
        let decodeUrl=(str)=>{return str.replace(/-/g, ' ')}
        let Designers=[];
        Designers[0]=[];
        Designers[1]=[];
        Designers[2]=[];
        Designers[3]=[];
        if(props.designers){
            let DesignerKey=0;
            let DesignerSplit=0;
            let DesignerSplitEnd=7;
            let DesignerSplitGroupEnd=4;
            for (const [keyA, valueA] of Object.entries(props.designers)) {
                if(DesignerKey==DesignerSplitGroupEnd){
                    Designers[DesignerKey-1]=Designers[DesignerKey-1].slice(0,-1);
                    Designers[DesignerKey-1].push('other');
                    DesignerKey++;
                }else{
                    if(DesignerKey<=DesignerSplitGroupEnd){
                    Designers[DesignerKey].push(valueA);
                    }
                }
                DesignerSplit++;
                if(DesignerSplit==DesignerSplitEnd){DesignerKey++;DesignerSplit=0;}
            }
        }
        for (const [keyB, valueB] of Object.entries(Designers)){
            res='';
            keyE=0;
            ult=[];
            for (const [keyC, valueC] of Object.entries(valueB)) {
                if(valueC=='other'){
                ult.push(<Link href="/designers" key={keyE} passHref><a><h5>{iprops.seemore}</h5></a></Link>);
                }else{
                ult.push(<Link key={keyE} href={`/@${encodeUrl(valueC.url)}?sort=the-newest`} passHref><a><h5>{valueC.name}</h5></a></Link>);
                }
                keyE++;
            }
            res=<div className="designersmanybox rememberthat manybox" data-sex={Array(iprops.designers)} key={`many-${key}`}>      
            {ult}
            </div>;
            result.push(res);
            key+=1;
        }

        return result;
    }
    const menumany = () => {
        let result=[];
        let key=0;
        let res,ult,keyE;
        let encodeUrl=(str)=>{return str.replace(/ /g,'-')}
        let decodeUrl=(str)=>{return str.replace(/-/g, ' ')}
        let Value=[];
        Value[iprops.sex.women]=[];
        Value[iprops.sex.men]=[];
        Value[iprops.sex.girl]=[];
        Value[iprops.sex.boy]=[];
        for (const [keyA, valueA] of Object.entries(props.navList)) {
            for (const [keyB, valueB] of Object.entries(valueA)) {
                if(keyA==iprops.sex.women){
                    Value[iprops.sex.women][keyB]=[];
                }
                if(keyA==iprops.sex.men){
                    Value[iprops.sex.men][keyB]=[];
                }
                if(keyA==iprops.sex.boy){
                    Value[iprops.sex.boy][keyB]=[];
                }
                if(keyA==iprops.sex.girl){
                    Value[iprops.sex.girl][keyB]=[];
                }
            }
        }
        for (const [keyA, valueA] of Object.entries(props.navList)) {
            for (const [keyB, valueB] of Object.entries(valueA)) {
                if(keyA==iprops.sex.men){
                    valueB.forEach(function(valueitem,i){
                        Value[iprops.sex.men][keyB].push(valueitem);
                    });
                }
                if(keyA==iprops.sex.women){
                    valueB.forEach(function(valueitem,i){
                        Value[iprops.sex.women][keyB].push(valueitem);
                    });
                }
                if(keyA==iprops.sex.boy){
                    valueB.forEach(function(valueitem,i){
                        Value[iprops.sex.boy][keyB].push(valueitem);
                    });
                }
                if(keyA==iprops.sex.girl){
                    valueB.forEach(function(valueitem,i){
                        Value[iprops.sex.girl][keyB].push(valueitem);
                    });
                }
            }
        }
        for (const [keyA, valueA] of Object.entries(Object.assign({},Value))) {   
            for (const [keyB, valueB] of Object.entries(valueA)) {
                res='';
                keyE=0;
                ult=[];
                ult.push(<Link key={`manybox-ult-${key}-${keyE}-true`} href={`/categories/${encodeUrl(keyA)}/${encodeUrl(keyB)}/?discount=true${defaultappend.replace('/?','&')}`}><a style={{color:'rgb(140,22,44)'}}>{locale!='fa' && locale!='ar' ? iprops.discounted+' ' : ''}{keyB}{locale=='fa' || locale=='ar' ? ' '+iprops.discounted : ''}</a></Link>);
                ult.push(<Link key={`manybox-ult-${key}-${keyE}-false`} href={`/categories/${encodeUrl(keyA)}/${encodeUrl(keyB)}/?discount=false${defaultappend.replace('/?','&')}`}>{iprops.all}</Link>);
                for (const [keyC, valueC] of Object.entries(valueB)) {
                    ult.push(<Link key={`manybox-ult-${key}-${keyE}`} href={`/categories/${encodeUrl(valueC.sex)}/${encodeUrl(keyB)}/${encodeUrl(valueC.title)}/?discount=false${defaultappend.replace('/?','&')}`}>{valueC.title}</Link>);
                    keyE++;
                }
                res=<div className="manybox" data-sex={keyA} key={`manybox-${key}`}>      
                <Link href={`/categories/${encodeUrl(keyA)}/${encodeUrl(keyB)}/?discount=false${defaultappend.replace('/?','&')}`} passHref><h5>{keyB}</h5></Link>
                {ult}
                </div>;
                result.push(res);
                key+=1;
            }
        }
        return result;
    }
    return (
        <React.Fragment>
            <div className="megabear">
            <div className="menumany">
                {menudesigners()}
                {menumany()}
            </div>
            </div>
        </React.Fragment>
    );
}
export default Megabear