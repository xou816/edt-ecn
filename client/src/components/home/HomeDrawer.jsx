import React from "react";
import {Button, Divider, createMuiTheme, Drawer, MuiThemeProvider, withStyles, withTheme} from "@material-ui/core";
import {FilterSubject} from "../FilterSubject";

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
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
        width: '25%'
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
                        anchor={permanent ? 'left' : 'bottom'}
                        open={open} onClose={onClose}
                        classes={{docked: classes.docked, paper: classes.drawer}}>
                    {permanent ? null : <Button onClick={onClose} color="secondary" className={classes.closeBtn} children="Terminer"/>}
                    <Divider/>
                    <FilterSubject/>
                </Drawer>
            </MuiThemeProvider>
        );
    }
}