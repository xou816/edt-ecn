import React from "react";
import {connect} from "react-redux";
import {Dialog} from "@material-ui/core";
import {Course} from "./Course";
import {blurEvent} from "../app/actions";

@connect(state => ({
    focus: state.app.focus,
    events: state.app.events
}), dispatch => ({
    blur: () => dispatch(blurEvent())
}))
export class FocusedCourse extends React.Component {

    event() {
        return this.props.events.find(e => e.id === this.props.focus);
    }

    open() {
        return this.props.focus != null;
    }

    render() {
        return (
            <Dialog fullWidth open={this.open()} onClose={() => this.props.blur()}>
                {!this.open() ? '' : (<Course long {...this.event()} />)}
            </Dialog>
        );
    }
}