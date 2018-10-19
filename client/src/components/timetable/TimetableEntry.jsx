import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";

const INCREMENT = 1000 * 60 * 15;
const DAY_MS = 1000 * 60 * 60 * 24;

@withStyles(theme => ({
    root: {
        display: 'flex',
        height: '100%',
        background: 'none',
        flex: 1,
        position: 'relative',
        margin: '3px'
    }
}))
export class TimetableEntry extends React.Component {

    start() {
        let event = this.props.event;
        return Math.floor(((event.start.valueOf() - this.props.offset.valueOf()) % DAY_MS) / INCREMENT) + 1;
    }

    span() {
        let event = this.props.event;
        return Math.floor((event.end.valueOf() - event.start.valueOf()) / INCREMENT);
    }

    day() {
        let event = this.props.event;
        return Math.floor((event.start.valueOf() - this.props.offset.valueOf()) / DAY_MS) + 1;
    }

    gridRow() {
        let {marker} = this.props;
        let start = this.start();
        let span = this.span();
        return {gridRow: `${start + (marker ? 0 : 1)} / span ${span}`};
    }

    gridColumn() {
        let {marker} = this.props;
        let day = this.day();
        return {gridColumn: (day + (marker ? 0 : 1)).toString()};
    }

    render() {
        let {classes, onClick, children} = this.props;
        return (
            <div onClick={onClick} style={{...this.gridRow(), ...this.gridColumn()}} className={classes.root}>
                {children}
            </div>
        );
    }
}