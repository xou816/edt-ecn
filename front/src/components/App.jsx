import * as React from 'react';
import {Timetable} from "./Timetable";
import Swipeable from 'react-swipeable';
import {Nav} from "./Nav";
import {next, prev} from "../app/actions";
import {connect} from "react-redux";
import {CssBaseline, LinearProgress} from "material-ui";
import {Sidebar} from "./Sidebar";
import {ExportButton} from "./ExportButton";

const mapState = state => ({
    loading: state.app.loading
});

const mapDispatch = dispatch => ({
    next: () => dispatch(next()),
    prev: () => dispatch(prev())
});

@connect(mapState, mapDispatch)
export class App extends React.Component {

    render() {
        let {next, prev, loading} = this.props;
        return (
            <React.Fragment>
                <CssBaseline/>
                <Swipeable onSwipedLeft={() => next()} onSwipedRight={() => prev()}>
                    <Nav/>
                    {loading ? <LinearProgress /> : null }
                    <Timetable/>
                </Swipeable>
                <Sidebar/>
                <ExportButton/>
            </React.Fragment>
        );
    }
}