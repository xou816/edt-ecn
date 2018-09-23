import React from 'react';
import {Slide} from "@material-ui/core";
import {Redirect, Route, Switch} from 'react-router-dom';
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
                       render={(props) => <Slide in direction="up"><IcsPage {...props}/></Slide>}/>
                <Route exact path={'/'}
                       render={(props) => <Slide in direction="up"><HomePage {...props}/></Slide>}/>
                <Route exact path={'/:calendar/:date'}
                       render={(props) => <Slide in direction="up"><TimetablePage {...props}/></Slide>}/>
                <Redirect exact from={'/:calendar'} to={'/:calendar/today'}/>
            </Switch>
        );
    }
}