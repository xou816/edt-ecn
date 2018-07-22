import * as React from 'react';
import {withStyles, Zoom} from "@material-ui/core";

const INCREMENT = 1000 * 60 * 15;
const DAY_MS = 1000 * 60 * 60 * 24;
const canUseDOM = !!(
    (typeof window !== 'undefined' &&
    window.document && window.document.createElement)
);

@withStyles(theme => ({
    root: {
        display: 'flex',
        height: '100%',
        background: 'none',
        flex: 1,
        position: 'relative',
    }
}))
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
        let {classes, onClick, children} = this.props;
        let inner = (
            <div onClick={onClick} style={{...this.gridRow(), ...this.gridColumn()}} className={classes.root}>
                {children}
            </div>
        );
        return canUseDOM ? <Zoom in={true}>{inner}</Zoom> : inner;
    }
}