import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";

const INCREMENT = 1000 * 60 * 15;
const MAX = 4 * 11;
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
        let {offset, event} = this.props;
        return Math.floor(((event.start.valueOf() - offset.valueOf()) % DAY_MS) / INCREMENT) + 1;
    }

    span() {
        let {event} = this.props;
        return Math.floor((event.end.valueOf() - event.start.valueOf()) / INCREMENT);
    }

    day() {
        let {offset, event} = this.props;
        return Math.floor((event.start.valueOf() - offset.valueOf()) / DAY_MS) + 1;
    }

    invalid() {
        // console.warn(this.props.event.pretty + ' hidden');
        return {display: 'none'};
    }

    gridRow() {
        let start = (this.start() + 1).toString();
        let span = this.span();
        return start <= MAX ? {gridRow: `${start} / span ${span}`} : this.invalid();
    }

    gridColumn() {
        let gridColumn = (this.day() + 1).toString();
        return gridColumn < 7 ? {gridColumn} : this.invalid();
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