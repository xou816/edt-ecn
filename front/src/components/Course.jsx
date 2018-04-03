import format from "date-fns/format";
import * as React from "react";
import {subjectId} from "../app/event";
import {TimetableEntry} from "./TimetableEntry";
import {Card, CardContent, Chip, Typography, withStyles} from "material-ui";
import {COLOR_CLASSES} from "./colors";

export function CourseSummary(event) {
    return (
        <Typography variant="subheading" component="h2" color="inherit">
            {event.full_subject.split('(').shift().trim()}
        </Typography>
    );
}

function displaySpan(event) {
    let start = format(event.start, 'H:mm');
    let end = format(event.end, 'H:mm');
    return `${start}h - ${end}h`;
}

export function CourseDetails(event) {
    return (
        <React.Fragment>
            <Typography component="p" color="inherit">{event.description}</Typography>
            <Typography component="p" color="inherit">{displaySpan(event)}</Typography>
            {event.location.length === 0 ? null : <Chip label={event.location} />}
        </React.Fragment>
    );
}

@withStyles(theme => ({
   root: {
       height: '100%',
       flexGrow: 1
   },
    ...COLOR_CLASSES
}))
export class Course extends React.Component {

    className() {
        return this.props.classes.root + ' ' + this.props.classes[`color${subjectId(this.props) % 10}`];
    }

    ifLarge(expr) {
        return this.props.end.valueOf() - this.props.start.valueOf() > 3*1000*60*15 ? expr : null;
    }

    render() {
        let classes = this.props.classes;
        return (
            <TimetableEntry event={this.props} offset={this.props.offset}>
                <Card className={this.className()}>
                    <CardContent className={this.className()}>
                        <CourseSummary {...this.props} />
                        {this.ifLarge(<CourseDetails {...this.props} />)}
                    </CardContent>
                </Card>
            </TimetableEntry>
        );
    }

}