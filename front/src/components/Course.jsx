import format from "date-fns/format";
import * as React from "react";
import {subjectId} from "../app/event";
import {TimetableEntry} from "./TimetableEntry";
import {Card, CardContent, Chip, Typography} from "material-ui";

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

export class Course extends React.Component {

    className() {
        return `color-${subjectId(this.props) % 10} timetable-grow`;
    }

    ifLarge(expr) {
        return this.props.end.valueOf() - this.props.start.valueOf() > 3*1000*60*15 ? expr : null;
    }

    render() {
        return (
            <TimetableEntry event={this.props} offset={this.props.offset} multipage={this.props.multipage}>
                <Card classes={{root: this.className()}}>
                    <CardContent classes={{root: this.className()}}>
                        <CourseSummary {...this.props} />
                        {this.ifLarge(<CourseDetails {...this.props} />)}
                    </CardContent>
                </Card>
            </TimetableEntry>
        );
    }

}