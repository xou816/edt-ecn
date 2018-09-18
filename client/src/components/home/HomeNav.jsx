import {Button, withStyles} from "@material-ui/core";
import {Nav} from "../Nav";
import React from "react";
import {applySelection} from "../../app/actions";
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import Done from '@material-ui/icons/Done';

@connect(state => ({canApply: state.app.meta.length > 0}),
        dispatch => ({apply: () => dispatch(applySelection())}))
@withRouter
@withStyles(theme => ({
    spread: {
        flexGrow: 1
    }
}))
export default class extends React.Component {

    apply() {
        let {history, apply} = this.props;
        apply().then(calendar => history.push('/'+calendar));
    }

    render() {
        let {classes, canApply} = this.props;
        return (
            <Nav>
                Sélectionner des calendriers
                <div className={classes.spread}/>
                <Button disabled={!canApply} onClick={() => this.apply()} color="secondary" variant="raised" style={{minWidth: 0}}>
                    <Done />
                </Button>
            </Nav>
        );
    }
}