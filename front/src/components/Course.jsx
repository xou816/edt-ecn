import format from "date-fns/format";
import * as React from "react";
import {subjectId} from "../app/event";
import {Card, CardContent, Chip, Typography, withStyles, Divider, Button} from "material-ui";
import {COLOR_CLASSES} from "../app/colors";
import Time from "material-ui-icons/AccessTime";

function CourseSummary({event, long, classes}) {
    return long ?
        [
            <Typography key="title" variant="title" component="h2" color="inherit">
                {event.full_subject}
            </Typography>,
            <Typography className={classes.par} key="subheading" variant="subheading" component="h3" color="inherit">
                ({event.subject})
            </Typography>
        ] :
        (
            <Typography className={classes.par} variant="subheading" component="h2" color="inherit">
                {event.full_subject}
            </Typography>
        );
}

function displaySpan(event) {
    let start = format(event.start, 'H:mm');
    let end = format(event.end, 'H:mm');
    return `${start}h - ${end}h`;
}

function CourseDetails({event, long, classes}) {
    return (
        <React.Fragment>
            {!long ? null : (
                <React.Fragment>
                    <Typography component="p" color="inherit">{event.description}</Typography>
                    <Typography component="p" color="inherit">
                        Intervenant : {event.organizer || 'non spécifié'}
                    </Typography>
                </React.Fragment>
            )}
            <Time className={classes.icon} />
            <Typography className={classes.icon} component="span" color="inherit">
                {displaySpan(event)}
            </Typography>
            <div className={classes.par}>
            {event.location.length === 0 ?
                null :
                event.location.split(',').map(l => <Chip className={classes.chip} key={l} label={l}/>)}
            </div>
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
        marginBottom: .5*theme.spacing.unit
    },
    icon: {
        verticalAlign: 'middle',
        display: 'inline',
        margin: `${.5*theme.spacing.unit}px 0`,
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
        return this.props.long || this.props.end.valueOf() - this.props.start.valueOf() > 5 * 1000 * 60 * 15 ? expr : null;
    }

    render() {
        let {long, colour} = this.props;
        return (
            <Card className={this.className()}>
                <CardContent className={this.className()} style={{backgroundColor: colour}}>
                    <CourseSummary long={long} classes={this.props.classes} event={this.props}/>
                    {this.ifLarge(<CourseDetails long={long} classes={this.props.classes} event={this.props}/>)}
                </CardContent>
            </Card>
        );
    }

}