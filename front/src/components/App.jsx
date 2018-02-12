import * as React from 'react';
import {Timetable} from "./Timetable";
import {Container} from "reactstrap";
import Swipeable from 'react-swipeable';
import {Nav} from "./Nav";
import {next, prev} from "../app/actions";
import {connect} from "react-redux";

const mapDispatch = dispatch => ({
   next: () => dispatch(next()),
   prev: () => dispatch(prev())
});

@connect(null, mapDispatch)
export class App extends React.Component {

    render() {
        return (
            <Container fluid className="mx-0 px-0">
                <Swipeable onSwipedLeft={() => this.props.next()} onSwipedRight={() => this.props.prev()}>
                    <Nav/>
                    <Timetable/>
                </Swipeable>
            </Container>
        );
    }
}