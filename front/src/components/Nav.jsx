import * as React from "react";
import {next, prev, toggleMenu, today} from "../app/actions";
import {connect} from "react-redux";
import {AppBar, Button, IconButton, Toolbar, Typography} from "material-ui";
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
export class Nav extends React.Component {


    render() {
        return (
            <AppBar position="static">
                <Toolbar style={{display: 'flex'}}>
                    <IconButton color="inherit" onClick={() => this.props.toggleMenu()} aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Button onClick={() => this.props.today()} color="inherit">Aujourd'hui</Button>
                    <div style={{flexGrow: 1}} />
                    {
                        this.props.isPhone ? null : [
                            <Button variant="raised" color="secondary"
                                    onClick={() => this.props.prev()}>Préc.</Button>,
                            <Button variant="raised" color="secondary"
                        onClick={() => this.props.next()}>Suiv.</Button>
                        ]
                    }
                </Toolbar>
            </AppBar>
        );
    }

}