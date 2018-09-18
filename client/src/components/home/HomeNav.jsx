import {Button, withStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import {Nav} from "../Nav";
import React from "react";
import {applySelection} from "../../app/actions";
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

@connect(null, dispatch => ({apply: () => dispatch(applySelection())}))
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
        let {classes} = this.props;
        return (
            <Nav>
                Calendriers
                <div className={classes.spread}/>
                <Button onClick={() => this.apply()} color="secondary" variant="raised" style={{minWidth: 0}}>
                    Consulter
                </Button>
            </Nav>
        );
    }
}