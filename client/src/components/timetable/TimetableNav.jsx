import React from "react";
import MenuIcon from '@material-ui/icons/Menu';
import LinkIcon from '@material-ui/icons/Link';
import Dashboard from '@material-ui/icons/Dashboard';
import ViewList from '@material-ui/icons/CalendarViewDay';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import {format} from 'date-fns';
import {Nav} from "../Nav";
import {Link} from "react-router-dom";
import DatePicker from "./DatePicker";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Menu from "@material-ui/core/Menu/Menu";
import Button from "@material-ui/core/Button/Button";
import {T, TranslateDate} from "../Translation";
import {HideOnMobile, ResponsiveButton} from "../Media";
import timeviewAware, {View} from "./timeviewAware";
import withCookies from "react-cookie/cjs/withCookies";

function DateDisplay({week, date, onClick}) {
    return <TranslateDate>{locale => {
        let formatted = <T.WeekN n={format(date, 'I', {locale})}/>;
        return <Button onClick={onClick} color="inherit" variant="text">{formatted}</Button>;
    }}</TranslateDate>;
}

@withCookies
@timeviewAware
@withStyles(theme => ({
    spread: {
        flexGrow: 1
    },
    nav: {
        flex: 0
    },
    compact: {
        paddingLeft: '2px',
        paddingRight: '2px'
    }
}))
export class TimetableNav extends React.Component {

    constructor(props) {
        super(props);
        this.ref = null;
    }

    toggleView() {
        let {cookies, toggleView} = this.props;
        toggleView().then(view => cookies.set('view', view, {path: '/'}));
    }

    render() {
        let {calendar, classes, date, onOpenPicker, onClosePicker, makeLink, open, next, prev, view} = this.props;
        let icon = ((view & View.LIST) > 0) ? <Dashboard/> : <ViewList/>;
        return (
            <Nav className={classes.nav}>
                <IconButton component={Link} to={'/'} color="inherit">
                    <MenuIcon/>
                </IconButton>
                <div ref={ref => this.ref = ref}>
                    <HideOnMobile>
                        <IconButton color="inherit" component={Link}
                                    children={<KeyboardArrowLeft/>}
                                    to={makeLink(prev(date))}/>
                        <IconButton color="inherit" component={Link}
                                    children={<KeyboardArrowRight/>}
                                    to={makeLink(next(date))}/>
                    </HideOnMobile>
                    <IconButton color="inherit" children={icon} onClick={() => this.toggleView()}/>
                    <DateDisplay date={date} onClick={onOpenPicker}/>

                </div>
                <Menu anchorEl={open ? this.ref : null} open={open} onClose={onClosePicker}>
                    <DatePicker date={date} makeLink={makeLink} onChange={onClosePicker}/>
                </Menu>
                <div className={classes.spread}/>
                <ResponsiveButton largeText={<T.ExportICS/>}
                                  component={Link}
                                  to={`/${calendar}/ics`}
                                  color="secondary"
                                  variant="contained"
                                  style={{minWidth: 0}}>
                    <LinkIcon/>
                </ResponsiveButton>
            </Nav>
        );
    }

}