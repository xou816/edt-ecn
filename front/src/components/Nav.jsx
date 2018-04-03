import * as React from "react";
import {next, prev, toggleMenu, today} from "../app/actions";
import {connect} from "react-redux";
import {AppBar, Button, IconButton, Toolbar, Typography, withStyles} from "material-ui";
import MenuIcon from 'material-ui-icons/Menu';

const mapState = state => ({
    date: state.app.date,
    isPhone: state.responsive.isPhone,
    menu: state.app.menu
});

const mapDispatch = dispatch => ({
    next: () => dispatch(next()),
    prev: () => dispatch(prev()),
    today: () => dispatch(today()),
    toggleMenu: () => dispatch(toggleMenu())
});

@connect(mapState, mapDispatch)
@withStyles(theme => ({
    toolbar: {
        display: 'flex'
    },
    spread: {
        flexGrow: 1
    },
    appbar: {
        position: 'sticky !important',
        top: 0
    }
}))
export class Nav extends React.Component {


    render() {
        let classes = this.props.classes;
        return (
            <AppBar className={classes.appbar} position="static">
                <Toolbar className={classes.toolbar}>
                    <IconButton color="inherit" onClick={() => this.props.toggleMenu()} aria-label="menu">
                        <MenuIcon/>
                    </IconButton>
                    <Button onClick={() => this.props.today()} color="inherit">Aujourd'hui</Button>
                    <div className={classes.spread} />
                    {
                        this.props.isPhone ? null : [
                            <Button key="left" variant="raised" color="secondary"
                                    onClick={() => this.props.prev()}>Préc.</Button>,
                            <Button key="right" variant="raised" color="secondary"
                                    onClick={() => this.props.next()}>Suiv.</Button>
                        ]
                    }
                </Toolbar>
            </AppBar>
        );
    }

}