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
    let key = props['for'];
    let raw = translations[lang][key];
    if (raw == null) {
        console.warn(`No translation for ${key}!`);
        raw = key;
    }
    return React.createElement(typeof raw === 'string' ? () => raw : raw, props);
}}</Consumer>;

const T = new Proxy({}, {
    get: (obj, key) => {
        if (translations[DEFAULT_LANG][key] != null) {
            return props => React.createElement(Translation, {...props, ['for']: key});
        } else {
            console.warn(`No translation for ${key}!`);
            return () => key;
        }
    }
});

const TranslateDate = ({children}) => <Consumer>{lang => children(LOCALES[lang])}</Consumer>;

export {Provider as Translate, TranslateDate, Translation, T};

