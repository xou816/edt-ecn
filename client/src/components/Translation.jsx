import React from 'react';
import translations from '../app/translations';
import frLocale from 'date-fns/locale/fr';
import enLocale from 'date-fns/locale/en-US';

const LOCALES = {
    'fr': frLocale,
    'en': enLocale
};
const DEFAULT_LANG = 'fr';

const {Provider, Consumer} = React.createContext(DEFAULT_LANG);

const Translation = props => <Consumer>{lang => {
    let raw = translations[lang][props['for']] || '';
    return React.createElement(typeof raw === 'string' ? () => raw : raw, props);
}}</Consumer>;

const T = Object.keys(translations[DEFAULT_LANG]).reduce((T, key) => {
    return {...T, [key]: props => React.createElement(Translation, {...props, ['for']: key})};
}, {});

const TranslateDate = ({children}) => <Consumer>{lang => children(LOCALES[lang])}</Consumer>;

export {Provider as Translate, TranslateDate, Translation, T};

