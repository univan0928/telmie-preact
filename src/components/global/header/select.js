import { h } from 'preact';

import { routes, langRoutes } from '../../app'
import { langPack } from '../../../utils/langPack'
import { route } from 'preact-router';
import { Link } from 'preact-router/match';
import FontAwesome from 'react-fontawesome';
import emoji from 'react-easy-emoji';
import { EN, RU, langs } from "../../../utils/consts";

import style from './style.scss';

const renderExcept = (elem, arr=[], isLocale = false) => {
    return  isLocale ? 
        arr.filter(el => el !== elem)
        : arr.filter(el => { });
}

const renderServices = ({curUrl, locale}) => {
    let item = '',
        listItems = '',
        urlStr = curUrl.toString();

    if(urlStr.indexOf(routes.LANGUAGE_PRACTICE) + 1){
        item = langPack[locale].SERVICES.LANGUAGE_PRACTICE;
        listItems = [
            <li><Link href={langRoutes(langs[locale].lang, routes.IMMIGRATION_LAW)}>{langPack[locale].SERVICES.IMMIGRATION_LAW}</Link></li>,
        ];
    } else if (urlStr.indexOf(routes.IMMIGRATION_LAW) + 1){
        item = langPack[locale].SERVICES.IMMIGRATION_LAW;
        listItems = [
            <li><Link href={langRoutes(langs[locale].lang, routes.LANGUAGE_PRACTICE)}>{langPack[locale].SERVICES.LANGUAGE_PRACTICE}</Link></li>,
        ];
    } else if (urlStr.indexOf(routes.LANGUAGE_LEARNERS) + 1){
        item = langPack[locale].SERVICES.LANGUAGE_LEARNERS;
        listItems = [ ];
    }
    return {item, listItems}
}

const renderLocale = (props) => {
    const changeLocalization = (code) => () => {
        props.changeLocale(code);
        switch(props.locale){
            case EN:
                !(window.location.pathname.toString().indexOf('/blog/') + 1)
                    && route(langRoutes(RU, window.location.pathname));
                break;
            case RU:
                let _link = `/${window.location.pathname.split('/').slice(2).join('/')}`;
                !(_link.toString().indexOf('/blog/') + 1) 
                    && route(langRoutes(EN, _link));
                break;
        };
    };
    const renderLocaleItem = (el) => ([
        emoji(el.emoji, (code) => (
            <div class={style.flagContainer} 
                style={{backgroundImage: `url(https://twemoji.maxcdn.com/2/svg/${code}.svg)`}} />
        )),
        el.name
    ]);
    
    let item = '',
        listItems = [];

    item = renderLocaleItem(langs[props.locale]);

    listItems = renderExcept(props.locale, props.languages, true).map(el => (
        <li onClick={changeLocalization(langs[el].code)} key={langs[el].code}>
            {renderLocaleItem(langs[el])}
        </li>
    ));

    return { item, listItems }
}

const Select = (props) => {

    let {item, listItems} = props.isLocale ? 
        renderLocale(props) : renderServices(props);

    return (
        <div class={props.isLocale ? `${style.title} ${style.localeSelect}` : style.title }>
            { item }
            {
                listItems.length > 0 && [
                    <FontAwesome name='angle-down'/>,
                    <ul>
                        { listItems }
                    </ul>
                ]
            }
        </div>
    )
}

export default Select;