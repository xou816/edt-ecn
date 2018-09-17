import React from "react";
import {Drawer, withStyles} from "@material-ui/core";
import {FilterSubject} from "../FilterSubject";

@withStyles(theme => ({
    drawer: {
        position: 'relative',
        zIndex: 0
    }
}))
export default class extends React.Component {

    render() {
        let {classes} = this.props;
        return (
            <Drawer classes={{paper: classes.drawer}} variant="permanent">
                <FilterSubject/>
            </Drawer>
        );
    }
}