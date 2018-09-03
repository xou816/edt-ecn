import {AppBar, Toolbar, withStyles} from "@material-ui/core";
import React from "react";

@withStyles(theme => ({
    toolbar: {
        display: 'flex'
    },
    appbar: {
        position: 'sticky !important',
        top: 0
    }
}))
export class Nav extends React.Component {

    render() {
        let {classes, children} = this.props;
        return (
            <AppBar className={classes.appbar} position="static">
                <Toolbar className={classes.toolbar}>
                    {children}
                </Toolbar>
            </AppBar>
        );
    }

}