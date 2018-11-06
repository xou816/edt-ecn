import {Nav} from "../Nav";
import React from "react";
import {applySelection, resetCalendars} from "../../app/actions";
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import Forward from '@material-ui/icons/Forward';
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from "@material-ui/core/Slide/Slide";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import {T} from '../Translation';
import {ResponsiveButton} from "../Media";

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
        apply().then(calendar => calendar != null && history.push('/' + calendar));
    }

    render() {
        let {classes, count, reset} = this.props;
        return (
            <Nav>
                {count > 0 &&
                <Slide in={count > 0} direction="right">
                    <Checkbox checked={count > 0}
                              onClick={reset}
                              disableRipple/>
                </Slide>}
                <div onClick={reset}>
                    <Typography color="inherit" variant="subtitle1"><T.SelectCalendars/></Typography>
                    {count > 0 &&
                    <Typography color="inherit" variant="caption"><T.NSelectedCalendars n={count}/></Typography>}
                </div>
                <div className={classes.spread}/>
                <ResponsiveButton largeText={<T.ApplySelection/>}
                        disabled={count === 0}
                        onClick={() => this.apply()}
                        color="secondary"
                        variant="contained"
                        style={{minWidth: 0}}>
                    <Forward/>
                </ResponsiveButton>
            </Nav>
        );
    }
}