import React from 'react';
import {connect} from "react-redux";
import {CssBaseline, Slide, Snackbar} from "@material-ui/core";
import {Redirect, Route, Switch} from 'react-router-dom';
import {TimetablePage} from "./timetable/TimetablePage";
import {HomePage} from "./home/HomePage";

function Animated(component) {
    return (props) => <Slide timeout={300} in={true} direction="up">{React.createElement(component, props)}</Slide>
}

function ErrorMessage({error}) {
    return <Snackbar open={error !== null} message={error} autoHideDuration={3000}/>;
}
const ConnectedErrorMessage = connect(state => ({error: state.app.error}))(ErrorMessage);

export class App extends React.Component {

    componentDidMount() {
        const jssStyles = document.getElementById('jss-server-side');
        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }

    render() {
        return (
            <React.Fragment>
                <CssBaseline/>
                <Switch>
                    <Route exact path={'/ics'} component={null}/>
                    <Route exact path={'/'} component={Animated(HomePage)}/>
                    <Redirect exact from={'/:calendar'} to={'/:calendar/today'}/>
                    <Route path={'/:calendar/:date'} component={Animated(TimetablePage)}/>
                </Switch>
                <ConnectedErrorMessage/>
            </React.Fragment>
        );
    }
}