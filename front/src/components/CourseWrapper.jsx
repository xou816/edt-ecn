import * as React from "react";
import {Course} from "./Course";
import {TimetableEntry} from "./TimetableEntry";
import {Button} from "reactstrap";

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
        return this.props.events.reduce(([largest, itsSpan], event) => {
            let span = event.end.valueOf() - event.start.valueOf();
            return span > itsSpan ? [event, span] : [largest, itsSpan];
        }, [null, 0]).shift();
    }

    multipage(expr) {
        return this.length() <= 1 ? null : expr;
    }

    prevPage() {
        this.setState({page: (this.state.page + this.length() - 1) % this.length()});
    }

    nextPage() {
        this.setState({page: (this.state.page + 1) % this.length()});
    }

    render() {
        return (
            <React.Fragment>
                <Course {...this.current()} offset={this.props.offset}/>
                {this.multipage(
                    <TimetableEntry event={this.largest()} offset={this.props.offset}>
                        <div className="event-outline">
                            <Button size="sm" className="left" onClick={() => this.prevPage()}>&laquo;</Button>
                            <Button size="sm" className="right" onClick={() => this.nextPage()}>&raquo;</Button>
                        </div>
                    </TimetableEntry>
                )}
            </React.Fragment>
        );
    }

}