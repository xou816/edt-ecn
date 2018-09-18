import {AppBar, Toolbar, withStyles} from "@material-ui/core";
import React from "react";

@withStyles(theme => ({
    toolbar: {
        display: 'flex'
    },
    spread: {
        flexGrow: 1
    }
}))
export class Nav extends React.Component {

    render() {
        let {classes, children} = this.props;
        return (
            <AppBar position="static">
                <Toolbar className={classes.toolbar}>
                    {children}
                </Toolbar>
            </AppBar>
        );
    }

}