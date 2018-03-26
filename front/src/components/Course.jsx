import format from "date-fns/format";
import * as React from "react";
import {Badge, Card, CardBody, CardText, CardTitle, Fade} from "reactstrap";
import {subjectId} from "../app/event";
import {TimetableEntry} from "./TimetableEntry";

export class Course extends React.Component {

    shortSubject() {
        return this.props.full_subject.split('(').shift().trim();
    }

    displaySpan() {
        let start = format(this.props.start, 'H:mm');
        let end = format(this.props.end, 'H:mm');
        return `${start}h - ${end}h`;
    }

    className() {
        return `color-${subjectId(this.props) % 10} m-1`;
    }

    ifLarge(expr) {
        return this.props.end.valueOf() - this.props.start.valueOf() > 3 ? expr : null;
    }

    render() {
        return (
            <TimetableEntry event={this.props} offset={this.props.offset}>
                <Card className={this.className()} inverse color="dark">
                    <CardBody>
                        <CardTitle>{this.shortSubject()}</CardTitle>
                        {
                            this.ifLarge(
                                <React.Fragment>
                                    <CardText>{this.props.description}</CardText>
                                    <CardText>{this.displaySpan()}</CardText>
                                    <Badge color="light">{this.props.location}</Badge>
                                </React.Fragment>
                            )
                        }
                    </CardBody>
                </Card>
            </TimetableEntry>
        );
    }

}