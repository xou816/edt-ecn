import format from "date-fns/format";
import * as React from "react";
import {subjectId} from "../app/event";
import {TimetableEntry} from "./TimetableEntry";
import {Card, CardContent, Chip, Dialog, Typography, withStyles} from "material-ui";
import {COLOR_CLASSES} from "../app/colors";

export function CourseSummary({event, long}) {
    return long ?
        [
            <Typography key="title" variant="title" component="h2" color="inherit">
                {event.full_subject}
            </Typography>,
            <Typography key="subheading" variant="subheading" component="h3" color="inherit">
                {event.subject}
            </Typography>

        ] :
        (
            <Typography variant="subheading" component="h2" color="inherit">
                {event.full_subject}
            </Typography>
        );
}

function displaySpan(event) {
    let start = format(event.start, 'H:mm');
    let end = format(event.end, 'H:mm');
    return `${start}h - ${end}h`;
}

export function CourseDetails({event, long}) {
    return (
        <React.Fragment>
            {!long ? null : (
                <React.Fragment>
                    <Typography component="p" color="inherit">{event.description}</Typography>
                    <Typography component="p" color="inherit">Intervenant
                        : {event.organizer || 'non spécifié'}</Typography>
                </React.Fragment>
            )}
            <Typography component="p" color="inherit">{displaySpan(event)}</Typography>
            {event.location.length === 0 ? null : event.location.split(',').map(l => <Chip key={l} label={l}/>)}
        </React.Fragment>
    );
}

@withStyles(theme => ({
    root: {
        height: '100%',
        flexGrow: 1,
        overflow: 'hidden'
    },
    ...COLOR_CLASSES
}))
export class Course extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            details: false
        };
    }

    className() {
        return this.props.classes.root + ' ' + this.props.classes[`color${subjectId(this.props) % 10}`];
    }

    ifLarge(expr) {
        return this.props.end.valueOf() - this.props.start.valueOf() > 3 * 1000 * 60 * 15 ? expr : null;
    }

    toggleDetails() {
        this.setState({
            details: !this.state.details
        });
    }

    render() {
        let classes = this.props.classes;
        return (
            <TimetableEntry event={this.props} offset={this.props.offset}>
                <Card className={this.className()} onClick={() => this.toggleDetails()}>
                    <CardContent className={this.className()}>
                        <CourseSummary event={this.props}/>
                        {this.ifLarge(<CourseDetails event={this.props}/>)}
                    </CardContent>
                </Card>
                <Dialog open={this.state.details} onClose={() => this.toggleDetails()}>
                    <Card className={this.className()} onClick={() => this.toggleDetails()}>
                        <CardContent className={this.className()}>
                            <CourseSummary long event={this.props}/>
                            <CourseDetails long event={this.props}/>
                        </CardContent>
                    </Card>
                </Dialog>
            </TimetableEntry>
        );
    }

}