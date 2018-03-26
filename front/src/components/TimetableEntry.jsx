import {Fade} from "reactstrap";
import * as React from 'react';

const INCREMENT = 1000 * 60 * 15;
const DAY_MS = 1000 * 60 * 60 * 24;

export class TimetableEntry extends React.Component {

    start() {
        let event = this.props.event;
        return Math.floor(((event.start.valueOf() - this.props.offset) % DAY_MS) / INCREMENT) + 1;
    }

    span() {
        let event = this.props.event;
        return Math.floor((event.end.valueOf() - event.start.valueOf()) / INCREMENT);
    }

    day() {
        let event = this.props.event;
        return Math.floor((event.start.valueOf() - this.props.offset) / DAY_MS) + 1;
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

    render() {
        return (
            <Fade in style={{...this.gridRow(), ...this.gridColumn()}} className="fade-card">
                {this.props.children}
            </Fade>
        );
    }
}