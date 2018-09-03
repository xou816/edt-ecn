import React from 'react';
import {connect} from "react-redux";
import {CssBaseline, Snackbar} from "@material-ui/core";
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import {TimetablePage} from "./timetable/TimetablePage";
import {HomePage} from "./home/HomePage";

const mapState = state => ({
    error: state.app.error
});

@connect(mapState)
export class App extends React.Component {

    componentDidMount() {
        const jssStyles = document.getElementById('jss-server-side');
        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }

    render() {
        let {error} = this.props;
        return (
            <React.Fragment>
                <CssBaseline/>
                <Router>
                    <Switch>
                        <Redirect exact from={'/:calendar'} to={'/:calendar/today'}/>
                        <Route exact path={'/'} component={HomePage}/>
                        <Route path={'/:calendar/:date'} component={TimetablePage}/>
                    </Switch>
                </Router>
                <Snackbar open={error !== null} message={error} autoHideDuration={3000}/>
            </React.Fragment>
        );
    }
}