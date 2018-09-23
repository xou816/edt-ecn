import React from "react";
import {Button, withStyles} from '@material-ui/core';
import Calendar from 'material-ui-pickers/DatePicker/components/Calendar';
import {MuiPickersUtilsProvider} from "material-ui-pickers";
import frLocale from 'date-fns/locale/fr';
import {format, isSameDay, isWeekend} from 'date-fns';
import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils";
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import classnames from 'classnames';
import {Link} from "react-router-dom";

@withStyles(theme => ({
    day: {
        width: 36,
        height: 36,
        fontSize: theme.typography.caption.fontSize,
        margin: '0 2px',
        minWidth: 0,
        borderRadius: '50%'
    },
    current: {
        color: theme.palette.primary.main,
        fontWeight: 600,
    },
    selected: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
        fontWeight: theme.typography.fontWeightMedium,
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
        },
    },
    disabled: {
        color: theme.palette.text.hint,
    }
}))
class Day extends React.Component {

    render() {
        let {date, link, selectedDate, dayInCurrentMonth, classes} = this.props;
        let className = classnames(classes.day, {
            [classes.current]: isSameDay(date, Date.now()),
            [classes.selected]: isSameDay(date, selectedDate) && !isWeekend(date) && dayInCurrentMonth,
            [classes.disabled]: !dayInCurrentMonth || isWeekend(date)
        });
        return (
            <Button component={Link} to={link} className={className}>
                {format(date, 'd')}
            </Button>
        );
    }
}

@withStyles(theme => ({
    picker: {
        margin: `0 ${theme.spacing.unit}px`,
        textAlign: 'center'
    }
}))
export default class extends React.Component {
    render() {
        let {date, makeLink, onChange, classes} = this.props;
        return (
            <div className={classes.picker}>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={frLocale}>
                    <Calendar date={date}
                              rightArrowIcon={<KeyboardArrowRight/>}
                              leftArrowIcon={<KeyboardArrowLeft/>}
                              onChange={onChange || (() => null)}
                              renderDay={(date, selectedDate, dayInCurrentMonth) =>
                                  <Day date={date}
                                       link={makeLink(date)}
                                       selectedDate={selectedDate}
                                       dayInCurrentMonth={dayInCurrentMonth}/>}/>
                </MuiPickersUtilsProvider>
                <Button variant="outlined" component={Link} to={makeLink(Date.now())} onClick={onChange}>Aujourd'hui</Button>
            </div>
        );
    }
}