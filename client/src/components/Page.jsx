import React from "react";
import {withStyles} from '@material-ui/core';
import classnames from 'classnames';

const withStyle = withStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        height: '100vh'
    },
    main: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        overflow: 'hidden'
    }
}));

export const Page = withStyle(({classes, className, children, ...others}) => {
    return <div className={classnames([classes.root, className])} {...others}>{children}</div>;
});

export const PageContent = withStyle(({classes, className, children, ...others}) => {
    return <div className={classnames([classes.main, className])} {...others}>{children}</div>;
});