import React from 'react';
import {Redirect, Route, Switch} from "react-router";
import {TimetablePage} from "./timetable/TimetablePage";
import {HomePage} from "./home/HomePage";
import IcsPage from "./ics/IcsPage";

export class App extends React.Component {

    componentDidMount() {
        const jssStyles = document.getElementById('jss-server-side');
        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }

    render() {
        return (
            <Switch>
                <Route exact path={'/:calendar/ics'}
                       render={(props) => <IcsPage {...props}/>}/>
                <Route exact path={'/'}
                       render={(props) => <HomePage {...props}/>}/>
                <Route exact path={'/:calendar/:date'}
                       render={(props) => <TimetablePage {...props}/>}/>
                <Redirect exact from={'/:calendar'} to={'/:calendar/today'}/>
            </Switch>
        );
    }
}