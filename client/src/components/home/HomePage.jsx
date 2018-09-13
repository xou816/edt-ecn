import React from "react";
import {Nav} from "../Nav";
import {CalendarSelect} from "../CalendarSelect";

export class HomePage extends React.Component {

    render() {
        return (
            <div>
                <Nav>Calendriers</Nav>
                <CalendarSelect/>
            </div>
        );
    }
}