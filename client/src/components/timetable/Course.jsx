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
import classnames from 'classnames';

const LARGE = 'large';
const MEDIUM = 'medium';

function CourseSummary({event, size}) {
    let subject = event.subject === 'unknown' ? event.category.trim() === '' ?
        event.description : `${event.category}` : `${event.category} ${event.subject}`;
    let full_subject = event.full_subject === 'unknown' ?
        '' : '(' + event.full_subject + ')';
    return size === LARGE ?
        [
            <Typography key="title" variant="h6" component="h6" color="inherit">
                {subject.trim()}
            </Typography>,
            <Typography gutterBottom key="subheading" variant="subtitle1" component="h3" color="inherit">
                {full_subject.trim()}
            </Typography>
        ] :
        (
            <Typography gutterBottom variant="subtitle1" component="h2" color="inherit">
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


const detailsStyle = withStyles(theme => ({
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
    }
}));

const CourseDetails = withStyles(detailsStyle)(({event, size, classes}) => {
    return (
        <React.Fragment>
            {size === LARGE && (
                <React.Fragment>
                    <Typography component="p" color="inherit">
                        <T.EventDescription/>{event.description}
                    </Typography>
                    <Typography component="p" color="inherit">
                        <T.EventOrganizer/>{event.organizer || <T.EventUnknownOrganizer/>}
                    </Typography>
                </React.Fragment>
            )}
            {size === LARGE || size === MEDIUM && (
                <Typography component="span" color="inherit" gutterBottom>
                    <Time fontSize="inherit" /> {displaySpan(event)}
                </Typography>
            )}
            {event.location.length === 0 ? null :
                <div className={classes.par}>
                    {event.location
                        .map(l => <Chip className={classes.chip} key={l} label={size === LARGE ? l : shorten(l, 10)}/>)}
                </div>}
        </React.Fragment>
    );
});

@withStyles(theme => ({
    root: {
        flexGrow: 1,
        overflow: 'hidden',
        margin: theme.spacing.unit
    },
    maximize: {
        height: '100%',
        margin: 0
    },
    ...COLOR_CLASSES
}))
export class Course extends React.Component {

    colorClass() {
        let {classes} = this.props;
        const color = `color${subjectId(this.props) % 10}`;
        return classes[color];
    }

    className(maximize) {
        let {classes} = this.props;
        return classnames({
            [classes.root]: true,
            [classes.maximize]: maximize,
            [this.colorClass()]: true
        });
    }


    render() {
        let {size, maximize, ...event} = this.props;
        return (
            <Card className={this.className(maximize)} elevation={maximize ? 1 : 0}>
                <CardContent className={this.colorClass()}>
                    <CourseSummary size={size} event={event}/>
                    <CourseDetails size={size} event={event}/>
                </CardContent>
            </Card>
        );
    }

}