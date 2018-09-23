import React from 'react';
import M from 'react-media';

const {Provider, Consumer} = React.createContext('mobile');

function RecursiveMedia({device, serverMatchDevices, queries, children, ...others}) {
    let factory = queries.reduce((prevChild, query, index) => {
        const defaultMatches = serverMatchDevices[index] === device;
        const childFunc = data => matches => prevChild([matches, ...data]);
        return data => React.createElement(M, {...others, query, defaultMatches}, childFunc(data));
    }, children);
    return factory([]);
}

function Media(props) {
    return (
        <Consumer>
            {device => <RecursiveMedia {...props} device={device}/>}
        </Consumer>
    );
}

export {Provider as MediaProvider, Media};