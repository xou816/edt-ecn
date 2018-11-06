import React from 'react';
import {connect} from "react-redux";
import Button from "@material-ui/core/Button/Button";

const withBrowser = connect(({browser}) => ({browser}));

export const ResponsiveButton = withBrowser(({browser, largeText, children, ...other}) => {
    const large = browser.greaterThan.small;
    delete other['dispatch'];
    return (
        <Button {...other} size={large ? 'large' : 'small'}>
            {<React.Fragment>
                {children}
                {large && '\xa0\xa0'}
                {large && largeText}
            </React.Fragment>}
        </Button>
    );
});

export const HideOnMobile = withBrowser(({browser, children}) => {
   return browser.greaterThan.small ? children : null;
});