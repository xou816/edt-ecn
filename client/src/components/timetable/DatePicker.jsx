import React from "react";
import {Button, withStyles} from '@material-ui/core';
import Calendar from 'material-ui-pickers/DatePicker/components/Calendar';
import {MuiPickersUtilsProvider} from "material-ui-pickers";
import frLocale from 'date-fns/locale/fr';
import {format, isSameDay, isWeekend, isMonday, isFriday, isSameISOWeek, setHours} from 'date-fns';
import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils";
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import classnames from 'classnames';
import {fade} from '@material-ui/core/styles/colorManipulator';
import {Link} from "react-router-dom";

const TODAY = setHours(Date.now(), 12);

@withStyles(theme => ({
    day: {
        width: 36,
        height: 36,
        fontSize: theme.typography.caption.fontSize,
        margin: '0 2px',
        padding: `${theme.spacing.unit}px ${2 * theme.spacing.unit}px`,
        minWidth: 0,
        borderRadius: '50%'
    },
    current: {
        color: theme.palette.secondary.main,
        fontWeight: '600',
    },
    selected: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.secondary.main,
        fontWeight: theme.typography.fontWeightMedium,
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
        },
    },
    selectedStart: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        marginRight: 0,
        width: 38
    },
    selectedEnd: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        marginLeft: 0,
        width: 38
    },
    selectedMid: {
        borderRadius: 0,
        margin: 0,
        width: 40
    },
    disabled: {
        color: theme.palette.text.hint,
    },
    currentSelected: {
        fontWeight: '600',
        backgroundColor: fade(theme.palette.secondary.main, 0.5),
        ['&:hover']: {
            backgroundColor: fade(theme.palette.secondary.main, 0.5)
        }
    }
}))
class Day extends React.Component {

    render() {
        let {week, date, link, selectedDate, dayInCurrentMonth, classes} = this.props;
        let weekend = isWeekend(date);
        let disabled = !dayInCurrentMonth || weekend;
        let mon = isMonday(date);
        let fri = isFriday(date);
        let strictSelected = isSameDay(date, selectedDate);
        let selected = (strictSelected || (isSameISOWeek(date, selectedDate) && week)) && !weekend;
        let className = classnames(classes.day, {
            [classes.current]: isSameDay(date, Date.now()),
            [classes.currentSelected]: strictSelected && week && !weekend,
            [classes.selected]: selected,
            [classes.selectedStart]: selected && week && mon,
            [classes.selectedEnd]: selected && week && fri,
            [classes.selectedMid]: selected && week && !mon && !fri,
            [classes.disabled]: disabled && !selected
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
        let {week, date, makeLink, onChange, classes} = this.props;
        return (
            <div className={classes.picker}>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={frLocale}>
                    <Calendar date={date}
                              rightArrowIcon={<KeyboardArrowRight/>}
                              leftArrowIcon={<KeyboardArrowLeft/>}
                              onChange={onChange || (() => null)}
                              renderDay={(date, selectedDate, dayInCurrentMonth) =>
                                  <Day date={date}
                                       week={week}
                                       link={makeLink(date)}
                                       selectedDate={selectedDate}
                                       dayInCurrentMonth={dayInCurrentMonth}/>}/>
                </MuiPickersUtilsProvider>
                <Button variant="outlined"
                        // disabled={week && isSameISOWeek(date, TODAY) || isSameDay(date, TODAY)}
                        component={Link}
                        to={makeLink(Date.now())}
                        onClick={onChange}>
                    {week ? "Cette semaine" : "Aujourd'hui"}
                </Button>
            </div>
        );
    }
}