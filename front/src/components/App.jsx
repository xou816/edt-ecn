import * as React from 'react';
import {Timetable} from "./Timetable";
import Swipeable from 'react-swipeable';
import {Nav} from "./Nav";
import {next, prev} from "../app/actions";
import {connect} from "react-redux";
import {CssBaseline, LinearProgress, Snackbar, Typography, withStyles} from "material-ui";
import {Sidebar} from "./Sidebar";
import {ExportButton} from "./ExportButton";
import Help from "material-ui-icons/Help";

const mapState = state => ({
    loading: state.app.loading,
    calendarReady: state.app.calendar !== null,
    error: state.app.error
});

const mapDispatch = dispatch => ({
    next: () => dispatch(next()),
    prev: () => dispatch(prev())
});

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

    render() {
        let {next, prev, loading, calendarReady, classes, error} = this.props;
        return (
            <React.Fragment>
                <CssBaseline/>
                <Swipeable onSwipedLeft={() => next()} onSwipedRight={() => prev()}>
                    <Nav/>
                    {loading ? <LinearProgress /> : null }
                    {calendarReady ? <Timetable/> : (
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