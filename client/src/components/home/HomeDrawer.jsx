import React from "react";
import {Button, Divider, createMuiTheme, Drawer, MuiThemeProvider, withStyles, withTheme} from "@material-ui/core";
import {FilterSubject} from "../FilterSubject";

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark'
    }
});

@withTheme()
@withStyles(theme => ({
    drawer: {
        position: 'relative',
        zIndex: 0,
        maxWidth: '100%',
        height: '100%'
    },
    docked: {
        flex: 1,
        flexBasis: 'content'
    },
    closeBtn: {
        width: '100%'
    },
}))
export default class extends React.Component {

    render() {
        let {classes, permanent, open, onClose, theme} = this.props;
        return (
            <MuiThemeProvider theme={permanent ? theme : darkTheme}>
                <Drawer variant={permanent ? 'permanent' : 'temporary'}
                        anchor={permanent ? 'right' : 'bottom'}
                        open={open} onClose={onClose}
                        classes={{docked: classes.docked, paper: classes.drawer}}>
                    {permanent ? null : [
                        <Button key="btn" onClick={onClose} color="secondary" className={classes.closeBtn} children="Terminer"/>,
                        <Divider key="div"/>
                    ]}
                    <FilterSubject/>
                </Drawer>
            </MuiThemeProvider>
        );
    }
}