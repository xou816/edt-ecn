import React from "react";
import MenuIcon from '@material-ui/icons/Menu';
import LinkIcon from '@material-ui/icons/Link';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import {addWeeks, format, subWeeks} from 'date-fns';
import {Nav} from "../Nav";
import {Link} from "react-router-dom";
import DatePicker from "./DatePicker";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Menu from "@material-ui/core/Menu/Menu";
import Button from "@material-ui/core/Button/Button";
import {T, TranslateDate} from "../Translation";
import timetableAware from "./timetableAware";
import {HideOnMobile, ResponsiveButton} from "../Media";

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
    }
}))
export class TimetableNav extends React.Component {

    constructor(props) {
        super(props);
        this.ref = null;
    }

    render() {
        let {calendar, classes, date, onOpenPicker, onClosePicker, makeLink, open, weekView} = this.props;
        return (
            <Nav className={classes.nav}>
                <IconButton component={Link} to={'/'} color="inherit">
                    <MenuIcon/>
                </IconButton>
                <div ref={ref => this.ref = ref}>
                    <HideOnMobile>
                        <IconButton color="inherit" component={Link}
                                    children={<KeyboardArrowLeft/>}
                                    to={makeLink(subWeeks(date, 1))}/>
                        <IconButton color="inherit" component={Link}
                                    children={<KeyboardArrowRight/>}
                                    to={makeLink(addWeeks(date, 1))}/>
                    </HideOnMobile>
                    <DateDisplay week={weekView} date={date} onClick={onOpenPicker}/>

                </div>
                <Menu anchorEl={open ? this.ref : null} open={open} onClose={onClosePicker}>
                    <DatePicker week={weekView} date={date} makeLink={makeLink} onChange={onClosePicker}/>
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