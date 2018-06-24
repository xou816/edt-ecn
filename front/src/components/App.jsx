import * as React from 'react';
import {Timetable} from "./Timetable";
import Swipeable from 'react-swipeable';
import {Nav} from "./Nav";
import {next, prev, setCalendar} from "../app/actions";
import {connect} from "react-redux";
import {CssBaseline, LinearProgress, Snackbar, Typography, withStyles} from "@material-ui/core";
import {Sidebar} from "./Sidebar";
import {ExportButton} from "./ExportButton";
import Help from "@material-ui/icons/Help";
import {withRouter, Route} from "react-router-dom";

const mapState = state => ({
    loading: state.app.loading,
    calendarReady: state.app.calendar !== null,
    error: state.app.error
});

const mapDispatch = (dispatch, ownProps) => ({
    next: () => dispatch(next(ownProps.history)),
    prev: () => dispatch(prev(ownProps.history)),
    setCalendar: (cal) => dispatch(setCalendar(ownProps.history, cal))
});

@withRouter
@connect(mapState, mapDispatch)
@withStyles(theme => ({
    caption: {
        fontSize: '1em',
        margin: '3em 1em'
    },
    icon: {
        fontSize: '3em'
    }
}))
export class App extends React.Component {

    getMatch() {
        return this.props.match.params.calendar;
    }

    componentDidMount() {
        this.props.setCalendar(this.getMatch());
    }

    render() {
        let {next, prev, loading, calendarReady, classes, error, match} = this.props;
        return (
            <React.Fragment>
                <CssBaseline/>
                <Swipeable onSwipedLeft={() => next()} onSwipedRight={() => prev()}>
                    <Nav/>
                    {loading ? <LinearProgress /> : null }
                    {calendarReady ? <Route path={`${match.url}/:date?`} component={Timetable} /> : (
                        <Typography className={classes.caption} align="center" paragraph component="p" variant="caption" color="textSecondary">
                            <Help className={classes.icon} /><br />Ouvrez le menu pour sélectionner un calendrier.
                        </Typography>
                    ) }
                </Swipeable>
                <Sidebar/>
                {calendarReady ? <ExportButton/> : null}
                <Snackbar open={error !== null} message={error} autoHideDuration={3000} />
            </React.Fragment>
        );
    }
}