import format from "date-fns/format";
import * as React from "react";
import {Badge, Card, CardBody, CardText, CardTitle, Fade} from "reactstrap";
import {subjectId} from "../app/event";

const INCREMENT = 1000*60*15;
const DAY_MS = 1000*60*60*24;

export class Course extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            zIndex: 0
        };
    }

    start() {
        return Math.floor(((this.props.event.start.valueOf() - this.props.offset)%DAY_MS)/INCREMENT) + 1;
    }

    span() {
        return Math.floor((this.props.event.end.valueOf() - this.props.event.start.valueOf())/INCREMENT);
    }

    day() {
        return Math.floor((this.props.event.start.valueOf() - this.props.offset)/DAY_MS) + 1;
    }

    shortSubject() {
        return this.props.event.full_subject.split('(').shift().trim();
    }

    gridRow() {
        let start = this.start();
        let span = this.span();
        return {gridRow: `${start + 1} / span ${span}`};
    }

    gridColumn() {
        let day = this.day();
        return {gridColumn: day.toString()};
    }

    displaySpan() {
        let start = format(this.props.event.start, 'H:mm');
        let end = format(this.props.event.end, 'H:mm');
        return `${start}h - ${end}h`;
    }

    className() {
        return `color-${subjectId(this.props.event)%10}`;
    }

    stackStyle() {
        let stack = this.props.stack == null ? 0 : this.props.stack;
        let f = .5;
        return {
            margin: `${f*stack}em -${f*stack}em -${f*stack}em ${10*f*stack}em`,
            zIndex: this.state.zIndex
        };
    }

    toggleZIndex() {
        this.setState({
            zIndex: this.state.zIndex > 0 ? 0 : 100-this.props.stack
        });
    }

    render() {
        return (
            <Fade in style={{ ...this.gridRow(), ...this.gridColumn() }} className="fade-card">
            <Card className={this.className()} style={this.stackStyle()} onClick={() => this.toggleZIndex()} inverse color="dark">
                <CardBody>
                    <CardTitle>{this.shortSubject()}</CardTitle>
                    {
                        this.span() > 3 ?
                        (<React.Fragment>
                            <CardText>{this.props.event.description}</CardText>
                            <CardText>{this.displaySpan()}</CardText>
                            <Badge color="light">{this.props.event.location}</Badge>
                        </React.Fragment>
                        ) : ''
                    }
                </CardBody>
            </Card>
            </Fade>
        );
    }

}