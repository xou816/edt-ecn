import * as React from "react";
import {next, prev, toggleMenu, today} from "../app/actions";
import {connect} from "react-redux";
import {Button, Fade} from "reactstrap";

const mapState = state => ({
    date: state.app.date,
    isPhone: state.responsive.isPhone,
    menu: state.app.menu
});

const mapDispatch = dispatch => ({
    next: () => dispatch(next()),
    prev: () => dispatch(prev()),
    today: () => dispatch(today()),
    toggleMenu: () => dispatch(toggleMenu())
});

@connect(mapState, mapDispatch)
export class Nav extends React.Component {

    buttonSize() {
        return this.props.isPhone ? "sm" : "lg";
    }

    render() {
        return (
            <div className="sticky-top">
                <div className="py-3 px-2 trans-nav">
                    <div className="float-right">
                        <Button size={this.buttonSize()} className="mx-1" outline color="primary"
                                onClick={() => this.props.prev()}>&laquo;</Button>
                        <Button size={this.buttonSize()} className="mx-1" outline color="primary"
                                onClick={() => this.props.next()}>&raquo;</Button>
                    </div>
                    {true ? null : <Button size={this.buttonSize()} className="mx-1" outline={!this.props.menu}
                            onClick={() => this.props.toggleMenu()} color="primary">...</Button>}
                    <Button size={this.buttonSize()} outline color="primary" className="mx-1"
                            onClick={() => this.props.today()}>Aujourd'hui</Button>
                </div>
                {
                    !this.props.menu ? null : (
                        <Fade in>
                            <div className="py-1 trans-nav text-center">
                                <Button size={this.buttonSize()} className="mx-2" color="link">Calendriers</Button>
                                <Button size={this.buttonSize()} className="mx-2" color="link">Filtrer</Button>
                            </div>
                        </Fade>
                    )
                }
            </div>
        );
    }

}