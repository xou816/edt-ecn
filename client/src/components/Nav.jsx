import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";

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