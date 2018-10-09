import React from "react";
import {connect} from "react-redux";
import {Course} from "./Course";
import {blurEvent} from "../../app/actions";
import Dialog from "@material-ui/core/Dialog/Dialog";

@connect(state => ({
    focus: state.app.focus,
    events: state.app.events
}), dispatch => ({
    blur: () => dispatch(blurEvent())
}))
export class FocusedCourse extends React.Component {

    get event() {
        return this.props.events.find(e => e.id === this.props.focus);
    }

    render() {
        let {blur, allowFocus, focus} = this.props;
        const open = focus !== null && allowFocus;
        return open && (
            <Dialog fullWidth open={true} onClose={() => blur()}>
                <Course long {...this.event} />
            </Dialog>
        );
    }
}