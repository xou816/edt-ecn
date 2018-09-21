import {Button, Checkbox, Typography, Slide, withStyles} from "@material-ui/core";
import {Nav} from "../Nav";
import React from "react";
import {applySelection, resetCalendars} from "../../app/actions";
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import Forward from '@material-ui/icons/Forward';

@connect(state => ({count: state.app.meta.length}),
        dispatch => ({apply: () => dispatch(applySelection()), reset: () => dispatch(resetCalendars())}))
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
        let {classes, count, reset} = this.props;
        const s = count > 1 ? 's' : '';
        return (
            <Nav>
                {count > 0 ?
                <Slide in={count > 0} direction="right">
                    <Checkbox checked={count > 0}
                              onClick={reset}
                              disableRipple/>
                </Slide> : null}
                <div onClick={reset}>
                    <Typography color="inherit" variant="subheading">Sélectionner des calendriers</Typography>
                    {count === 0 ? null : <Typography color="inherit" variant="caption">{count} calendrier{s} sélectionné{s}</Typography>}
                </div>
                <div className={classes.spread}/>
                <Button size="small"
                        disabled={count === 0}
                        onClick={() => this.apply()}
                        color="secondary"
                        variant="raised"
                        style={{minWidth: 0}}>
                    <Forward />
                </Button>
            </Nav>
        );
    }
}