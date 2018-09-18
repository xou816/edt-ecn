import React from "react";
import {Button, IconButton, withStyles} from "@material-ui/core";
import Back from '@material-ui/icons/ArrowBack';
import LinkIcon from '@material-ui/icons/Link';
import frLocale from 'date-fns/locale/fr';
import {format} from 'date-fns';
import {Nav} from "../Nav";
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import {toggleMenu} from "../../app/actions";

function DateDisplay({date, onClick}) {
    let doFormat = d => format(d, 'Do MMMM', {locale: frLocale});
    let dateFormatted= doFormat(date);
    return <Button onClick={onClick} color="inherit" variant="flat">{dateFormatted}</Button>;
}

@withStyles(theme => ({
    spread: {
        flexGrow: 1
    },
    nav: {
        flex: 0
    }
}))
export class TimetableNav extends React.Component {


    render() {
        let {classes, date, onDateClick} = this.props;
        return (
            <Nav className={classes.nav}>
                <IconButton component={Link} to={'/'} color="inherit">
                    <Back/>
                </IconButton>
                <DateDisplay date={date} onClick={onDateClick}/>
                <div className={classes.spread}/>
                <Button component={Link} to={'/'} color="secondary" variant="raised" style={{minWidth: 0}}>
                    <LinkIcon/>
                </Button>
            </Nav>
        );
    }

}