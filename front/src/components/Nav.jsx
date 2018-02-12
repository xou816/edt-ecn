import * as React from "react";
import {next, prev, today} from "../app/actions";
import {connect} from "react-redux";
import {Button} from "reactstrap";

const mapState = state => ({
    date: state.app.date,
    isPhone: state.responsive.isPhone
});

const mapDispatch = dispatch => ({
    next: () => dispatch(next()),
    prev: () => dispatch(prev()),
    today: () => dispatch(today())
});

@connect(mapState, mapDispatch)
export class Nav extends React.Component {

    render() {
        return (
            <div className="py-3 px-2 sticky-top trans-nav text-center">
                <Button size={this.props.isPhone ? "sm" : "lg"} outline color="primary" className="float-left" onClick={() => this.props.prev()}>&laquo;</Button>
                <Button size={this.props.isPhone ? "sm" : "lg"} outline color="primary" onClick={() => this.props.today()}>Aujourd'hui</Button>
                <Button size={this.props.isPhone ? "sm" : "lg"} outline color="primary" className="float-right" onClick={() => this.props.next()}>&raquo;</Button>
            </div>
        );
    }

}