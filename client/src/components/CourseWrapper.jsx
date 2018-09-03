import React from "react";
import {Course} from "./Course";
import {TimetableEntry} from "./TimetableEntry";
import {Button, withStyles} from "@material-ui/core";
import {focusEvent} from "../app/actions";
import {connect} from "react-redux";

@connect(null, dispatch => ({
    focusEvent: id => dispatch(focusEvent(id))
}))
@withStyles(theme => ({
    btn: {
        position: 'absolute !important',
        bottom: '5px',
        zIndex: 3000
    },
    btnLeft: {
        left: '5px'
    },
    btnRight: {
        right: '5px'
    }
}))
export class CourseWrapper extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 0
        };
    }

    length() {
        return this.props.events.length;
    }

    current() {
        return this.props.events[this.state.page % this.length()];
    }

    largest() {
        let min = this.props.events
            .map(e => e.start)
            .reduce((min, cur) => cur < min ? cur : min);
        let max = this.props.events
            .map(e => e.end)
            .reduce((max, cur) => cur > max ? cur : max);
        return {start: min, end: max};
    }

    multipage(expr, fallback) {
        return this.length() <= 1 ? fallback : expr;
    }

    prevPage(e) {
        this.setState({page: (this.state.page + this.length() - 1) % this.length()});
        e.stopPropagation();
    }

    nextPage(e) {
        this.setState({page: (this.state.page + 1) % this.length()});
        e.stopPropagation();
    }

    render() {
        let {classes, focusEvent} = this.props;
        let curr = this.current();
        return (
            <React.Fragment>
                <TimetableEntry event={curr} offset={this.props.offset} onClick={() => focusEvent(curr.id)}>
                    <Course {...curr} />
                </TimetableEntry>
                {this.multipage(
                    <TimetableEntry event={curr} offset={this.props.offset} onClick={() => focusEvent(curr.id)}>
                        <Button mini className={`${classes.btn} ${classes.btnLeft}`}
                                onClick={e => this.prevPage(e)} variant="fab" color="primary" aria-label="prev">
                            &laquo;
                        </Button>
                        <Button mini className={`${classes.btn} ${classes.btnRight}`}
                                onClick={e => this.nextPage(e)} variant="fab" color="primary" aria-label="next">
                            &raquo;
                        </Button>
                    </TimetableEntry>
                )}
            </React.Fragment>
        );
    }

}