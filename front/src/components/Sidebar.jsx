import React from "react";
import {Button, Divider, Drawer, Step, StepContent, StepLabel, Stepper} from "material-ui";
import {connect} from "react-redux";
import {finishSelection, toggleMenu} from "../app/actions";
import {CalendarSelect} from "./CalendarSelect";

const mapState = state => ({
    shown: state.app.menu
});

const mapDispatch = dispatch => ({
    hide: () => {
        dispatch(finishSelection());
        dispatch(toggleMenu());
    },
    show: () => dispatch(toggleMenu())
});

@connect(mapState, mapDispatch)
export class Sidebar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: 0
        };
    }

    next() {
        return () => this.setState({step: this.state.step + 1});
    }

    render() {
        return (
            <Drawer open={this.props.shown} onClose={this.props.hide}>
                <Button onClick={this.props.hide} color="primary">
                    Fermer
                </Button>
                <Divider/>
                <Stepper activeStep={this.state.step} orientation="vertical">
                    <Step>
                        <StepLabel>Choisir des calendriers</StepLabel>
                        <StepContent>
                            <CalendarSelect/>
                            <Button onClick={this.next()} variant="raised" color="primary">Suivant</Button>
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel>Filtrer les matières</StepLabel>
                        <StepContent>
                            <CalendarSelect/>
                            <Button onClick={this.next()} variant="raised" color="primary">Terminer</Button>
                        </StepContent>
                    </Step>
                </Stepper>
            </Drawer>
        );
    }

}