import * as React from 'react';
import {Timetable} from "./Timetable";
import Swipeable from 'react-swipeable';
import {Nav} from "./Nav";
import {next, prev} from "../app/actions";
import {connect} from "react-redux";
import {CssBaseline} from "material-ui";
import {Sidebar} from "./Sidebar";

const mapDispatch = dispatch => ({
   next: () => dispatch(next()),
   prev: () => dispatch(prev())
});

@connect(null, mapDispatch)
export class App extends React.Component {

    render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <Swipeable onSwipedLeft={() => this.props.next()} onSwipedRight={() => this.props.prev()}>
                    <Nav/>
                    <Timetable/>
                </Swipeable>
                <Sidebar/>
            </React.Fragment>
        );
    }
}