import format from "date-fns/format";
import React from "react";
import {subjectId} from "../../app/event";
import Time from "@material-ui/icons/AccessTime";
import {COLOR_CLASSES} from "../../app/theme";
import Typography from "@material-ui/core/Typography/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Card from "@material-ui/core/Card/Card";
import Chip from "@material-ui/core/Chip/Chip";
import {T} from "../Translation";

function CourseSummary({event, long, classes}) {
    let subject = event.subject === 'unknown' ? event.category.trim() === '' ?
        event.description : `${event.category}` : `${event.category} ${event.subject}`;
    let full_subject = event.full_subject === 'unknown' ?
        '' : '(' + event.full_subject + ')';
    return long ?
        [
            <Typography key="title" variant="h6" component="h6" color="inherit">
                {subject.trim()}
            </Typography>,
            <Typography className={classes.par} key="subheading" variant="subtitle1" component="h3" color="inherit">
                {full_subject.trim()}
            </Typography>
        ] :
        (
            <Typography className={classes.par} variant="subtitle1" component="h2" color="inherit">
                {subject.trim()}
            </Typography>
        );
}

function displaySpan(event) {
    let start = format(event.start, 'H:mm');
    let end = format(event.end, 'H:mm');
    return `${start}h - ${end}h`;
}

function shorten(str, len) {
    const shorter = len < str.length;
    return str.substring(0, len) + (shorter ? '...' : '')
}

function CourseDetails({event, long, classes}) {
    return (
        <React.Fragment>
            {!long ? null : (
                <React.Fragment>
                    <Typography component="p" color="inherit">
                        <T.EventDescription/>{event.description}
                    </Typography>
                    <Typography component="p" color="inherit">
                        <T.EventOrganizer/>{event.organizer || <T.EventUnknownOrganizer/>}
                    </Typography>
                    <Time className={classes.icon}/>
                    <Typography className={classes.icon} component="span" color="inherit">
                        {displaySpan(event)}
                    </Typography>
                </React.Fragment>
            )}
            {event.location.length === 0 ? null :
                <div className={classes.par}>
                    {event.location
                        .map(l => <Chip className={classes.chip} key={l} label={long ? l : shorten(l, 10)}/>)}
                </div>}
        </React.Fragment>
    );
}

@withStyles(theme => ({
    root: {
        height: '100%',
        flexGrow: 1,
        overflow: 'hidden'
    },
    par: {
        marginBottom: .5 * theme.spacing.unit
    },
    icon: {
        verticalAlign: 'middle',
        display: 'inline',
        margin: `${.5 * theme.spacing.unit}px 0`,
        paddingRight: theme.spacing.unit
    },
    chip: {
        margin: 2
    },
    ...COLOR_CLASSES
}))
export class Course extends React.Component {

    className() {
        return this.props.classes.root + ' ' + this.props.classes[`color${subjectId(this.props) % 10}`];
    }

    ifLarge(expr) {
        let {long, end, start} = this.props;
        return long || end.valueOf() - start.valueOf() > 6 * 1000 * 60 * 15 ? expr : null;
    }

    render() {
        let {long, colour, classes, ...event} = this.props;
        return (
            <Card className={this.className()}>
                <CardContent className={this.className()} style={{backgroundColor: colour}}>
                    <CourseSummary long={long} classes={classes} event={event}/>
                    {this.ifLarge(<CourseDetails long={long} classes={classes} event={event}/>)}
                </CardContent>
            </Card>
        );
    }

}