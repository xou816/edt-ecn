import React from "react";
import {Button, Divider, Drawer, LinearProgress, Step, StepContent, StepLabel, Stepper} from "material-ui";
import {connect} from "react-redux";
import {applySelection, getSubjects, toggleMenu} from "../app/actions";
import {CalendarSelect} from "./CalendarSelect";
import {FilterSubject} from "./FilterSubject";

const mapState = state => ({
    shown: state.app.menu,
    loading: state.app.loading
});

const mapDispatch = dispatch => ({
    complete: () => {
        dispatch(applySelection())
            .then(_ => dispatch(toggleMenu()));
    },
    getSubjects: () => dispatch(getSubjects())
});

@connect(mapState, mapDispatch)
export class Sidebar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: 0
        };
    }

    next(callback) {
        return () => {
            let then = () => this.setState({step: this.state.step + 1})
            callback != null ? callback().then(then) : then();
        }
    }

    prev() {
        return () => this.setState({step: this.state.step - 1});
    }

    render() {
        return (
            <Drawer open={this.props.shown} onClose={this.props.complete}>
                <Button onClick={this.props.complete} color="primary">
                    Fermer
                </Button>
                <Divider/>
                {this.props.loading ? <LinearProgress /> : null }
                <Stepper activeStep={this.state.step} orientation="vertical">
                    <Step>
                        <StepLabel>Choisir des calendriers</StepLabel>
                        <StepContent>
                            <CalendarSelect/>
                            <Button onClick={this.next(this.props.getSubjects)} variant="raised" color="primary">Suivant</Button>
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel>Filtrer les matières</StepLabel>
                        <StepContent>
                            <FilterSubject />
                            <Button onClick={this.prev()} variant="raised">Précédent</Button>
                            {' '}
                            <Button onClick={this.props.complete} variant="raised" color="primary">Terminer</Button>
                        </StepContent>
                    </Step>
                </Stepper>
            </Drawer>
        );
    }

}