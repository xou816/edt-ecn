import React from "react";
import {FilterSubject} from "./FilterSubject";
import {connect} from 'react-redux';
import {theme} from "../../app/theme";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer/Drawer";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import Divider from "@material-ui/core/Divider/Divider";
import Slide from "@material-ui/core/Slide/Slide";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import {T} from '../Translation';

const darkTheme = createMuiTheme({
    ...theme,
    palette: {
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
                    <Typography className={classes.help} variant="subtitle1" align="center" color="textSecondary" children={<T.FilterForSelection />}/> :
                    <Button onClick={onClose} color="secondary" className={classes.closeBtn}><T.Done/></Button>}
                <Divider/>
                <FilterSubject/>
            </Drawer>
        );
        return permanent ?
            count > 0 && <Slide in={true} direction="left" children={drawer}/> :
            <MuiThemeProvider theme={darkTheme} children={drawer}/>;
    }
}