import {TimetableEntry} from "./TimetableEntry";
import {addDays, addHours, addMinutes, format, isSameDay, startOfDay} from "date-fns";
import Divider from "@material-ui/core/Divider/Divider";
import React from "react";
import {TranslateDate} from "../../../build/components/Translation";
import Typography from "@material-ui/core/Typography/Typography";
import {connect} from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import classnames from 'classnames';

const styled = withStyles(theme => ({
    now: {
        width: '100%',
        backgroundColor: theme.palette.secondary.main,
        height: '2px'
    },
    hour: {
        top: '-1em',
        left: 0,
        padding: '0 6px',
        position: 'absolute',
        color: theme.palette.grey[400]
    },
    important: {
        color: theme.palette.text.secondary
    },
    bg: {
        background: theme.palette.text.secondary,
        opacity: 0.1,
        display: 'block',
        height: '100%',
        width: '100%',
    }
}));

export const withRefHour = connect(state => ({refHour: state.app.ref}));

export const IsVisibleOn = day => withRefHour(({refHour, date, children}) => {
    const theDay = addHours(startOfDay(day), refHour);
    return isSameDay(theDay, date) && date >= theDay && date <= addHours(theDay, 12) ? children : null;
});

export function Separators({days}) {
    return Array.from({length: 12}, (x, i) => (
        <Divider key={`sep_${i}`} style={{gridRow: `${4 * i + 2} / span 4`, gridColumn: `2 / span ${days}`}}/>
    ));
}

export const Hour = styled(({classes, hour, important}) => {
    const formatted = format(hour, 'HH:mm');
    return (
        <TimetableEntry marker event={{start: hour, end: addMinutes(hour, 15)}}>
            <Typography className={classnames({[classes.hour]: true, [classes.important]: important})}
                        align="center" color="textSecondary" key={formatted}>
                {formatted}
            </Typography>
        </TimetableEntry>
    );
});

export const Hours = withRefHour(({day, refHour}) => {
    return Array.from({length: 12}, (x, i) => (
        <Hour key={`hour_${i}`} hour={addHours(day, refHour + i)}/>
    ));
});

export function Days({length, date}) {
    return Array.from({length}, (x, i) => {
        let curDate = addDays(date, i);
        let today = isSameDay(curDate, Date.now());
        return (
            <TranslateDate key={i}>{locale => (
                <Typography align="center"
                            color={today ? 'secondary' : 'textSecondary'} key={i.toString()}
                            style={{gridColumn: i + 2, gridRow: '1 / span 1'}}>
                    {format(curDate, 'eee d MMM', {locale}).toUpperCase()}
                </Typography>
            )}</TranslateDate>
        )
    });
}

export const Marker = styled(({classes}) => {
    let now = Date.now();
    return (
        <TimetableEntry event={{start: now, end: addMinutes(now, 15)}}>
            <Divider className={classes.now}/>
        </TimetableEntry>
    );
});

export const CurrentDay = withRefHour(styled(({date, classes, refHour}) => {
    date = addHours(startOfDay(date), refHour);
    const [start, end] = [date, addHours(date, 11)];
    return (
        <TimetableEntry event={{start, end}}>
            <div className={classes.bg}/>
        </TimetableEntry>
    );
}));

const {Provider, Consumer} = React.createContext(0);
export {Provider as OffsetProvider, Consumer as OffsetConsumer};