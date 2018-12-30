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
import timetableAware, {View} from "./timetableAware";
import {ResponsiveButton} from "../Media";

function DateDisplay({week, date, onClick}) {
    return <TranslateDate>{locale => {
        let formatted = <T.WeekN n={format(date, 'I', {locale})}/>;
        return <Button onClick={onClick} color="inherit" variant="text">{formatted}</Button>;
    }}</TranslateDate>;
}

@timetableAware
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

    render() {
        let {calendar, classes, date, onOpenPicker, onClosePicker, makeLink, open, next, prev, view, toggleView} = this.props;
        let icon = ((view & View.LIST) > 0) ? <Dashboard/> : <ViewList/>;
        return (
            <Nav className={classes.nav}>
                <IconButton component={Link} to={'/'} color="inherit">
                    <MenuIcon/>
                </IconButton>
                <div ref={ref => this.ref = ref}>
                    <IconButton color="inherit" component={Link}
                                className={classes.compact}
                                children={<KeyboardArrowLeft/>}
                                to={makeLink(prev(date))}/>
                    <IconButton color="inherit" component={Link}
                                className={classes.compact}
                                children={<KeyboardArrowRight/>}
                                to={makeLink(next(date))}/>
                    <IconButton color="inherit" children={icon} onClick={toggleView}/>
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