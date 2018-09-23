import React from "react";
import {Button, Divider, Typography, createMuiTheme, Drawer, MuiThemeProvider, withStyles, Slide} from "@material-ui/core";
import {FilterSubject} from "../FilterSubject";
import {connect} from 'react-redux';
import {palette} from "../../app/theme";

const darkTheme = createMuiTheme({
    palette: {
        ...palette,
        type: 'dark'
    }
});

@connect(state => ({count: state.app.meta.length}))
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
    help: {
        margin: `${2 * theme.spacing.unit}px 0`
    }
}))
export default class extends React.Component {

    render() {
        let {classes, permanent, open, onClose, count} = this.props;
        const drawer = (
            <Drawer variant={permanent ? 'permanent' : 'temporary'}
                    anchor={permanent ? 'right' : 'bottom'}
                    open={open} onClose={onClose}
                    classes={{docked: classes.docked, paper: classes.drawer}}>
                {permanent ?
                    <Typography className={classes.help} variant="subheading" align="center" color="textSecondary" children={"Filtrer les matières pour la sélection"}/> :
                    <Button onClick={onClose} color="secondary" className={classes.closeBtn} children="Terminer"/>}
                <Divider/>
                <FilterSubject/>
            </Drawer>
        );
        return permanent ?
            count > 0 && <Slide in={true} direction="left" children={drawer}/> :
            <MuiThemeProvider theme={darkTheme} children={drawer}/>;
    }
}