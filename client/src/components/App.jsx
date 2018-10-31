import React from 'react';
import {Redirect, Route, Switch} from "react-router";
import {TimetablePage} from "./timetable/TimetablePage";
import {HomePage} from "./home/HomePage";
import IcsPage from "./other/IcsPage";
import withCookies from "react-cookie/cjs/withCookies";
import {Translate} from "./Translation";
import AboutPage from "./other/AboutPage";

@withCookies
export class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            language: props.cookies.get('language') || 'fr'
        };
    }

    switchLanguage() {
        return () => {
            const language = this.state.language === 'fr' ? 'en' : 'fr';
            this.setState({language});
            this.props.cookies.set('language', language, {path: '/'});
        }
    }

    componentDidMount() {
        const jssStyles = document.getElementById('jss-server-side');
        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }

    render() {
        return (
            <Translate value={this.state.language}>
                <Switch>
                    <Route exact path={'/:calendar/ics'}
                           render={(props) => <IcsPage {...props}/>}/>
                    <Route exact path={'/'}
                           render={(props) => <HomePage switchLanguage={this.switchLanguage()} {...props}/>}/>
                    <Route exact path={'/about'}
                           render={(props) => <AboutPage {...props}/>}/>
                    <Route exact path={'/:calendar/:date'}
                           render={(props) => <TimetablePage {...props}/>}/>
                    <Redirect exact from={'/:calendar'} to={'/:calendar/today'}/>
                </Switch>
            </Translate>
        );
    }
}