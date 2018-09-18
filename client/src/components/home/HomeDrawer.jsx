import React from "react";
import {Drawer, CircularProgress, withStyles} from "@material-ui/core";
import {FilterSubject} from "../FilterSubject";
import connect from "react-redux/es/connect/connect";

@connect(state => ({loading: state.app.loading}))
@withStyles(theme => ({
    drawer: {
        position: 'relative',
        zIndex: 0
    },
    docked: {
        width: '25%'
    }
}))
export default class extends React.Component {

    render() {
        let {classes, permanent, open, onClose, loading} = this.props;
        return (
            <Drawer variant={permanent ? 'permanent' : 'temporary'} open={open} onClose={onClose}
                    classes={{docked: classes.docked, paper: classes.drawer}}>
                <FilterSubject/>
                {loading ? <CircularProgress size={50}/> : null}
            </Drawer>
        );
    }
}