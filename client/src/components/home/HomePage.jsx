import React from "react";
import {Nav} from "../Nav";
import {CalendarSelect} from "../CalendarSelect";
import HomeDrawer from "./HomeDrawer";

export class HomePage extends React.Component {

    render() {
        return (
            <div>
                <Nav>Calendriers</Nav>
                <div>
                    <HomeDrawer/>
                    <CalendarSelect/>
                </div>
            </div>
        );
    }
}