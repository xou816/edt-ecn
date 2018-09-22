import React from 'react';
import ReactMedia from 'react-media';

const {Provider, Consumer} = React.createContext('mobile');

function Media({serverMatchDevices, ...others}) {
    return (
        <Consumer>
            {device => <ReactMedia {...others} defaultMatches={serverMatchDevices.indexOf(device) > -1}/>}
        </Consumer>
    );
}

export {Provider as MediaProvider, Media};