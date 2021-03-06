import React from 'react';
import {TimetableNav} from "./TimetableNav";
import {connect} from "react-redux";
import {getCalendar} from "../../app/actions";
import {Page, PageContent} from "../Page";
import DatePicker from "./DatePicker";
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer/Drawer";
import NoSsr from "@material-ui/core/NoSsr/NoSsr";
import SwipeableTimeview from "./SwipeableTimeview";
import timeviewAware from "./timeviewAware";

@timeviewAware
@connect(({browser}) => ({isLarge: browser.greaterThan.medium}),
    dispatch => ({getCalendar: calendar => dispatch(getCalendar(calendar))}))
@withStyles(theme => ({
    drawer: {
        position: 'relative',
        zIndex: 0,
        flexGrow: 0
    },
    drawerHidden: {
        width: 0
    }
}))
export class TimetablePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    toggleDatePicker(open) {
        return () => this.setState({open});
    }

    componentDidMount() {
        let {getCalendar, calendar} = this.props;
        getCalendar(calendar);
    }

    render() {
        let {classes, isLarge} = this.props;
        return (
            <Page>
                <TimetableNav open={this.state.open && !isLarge}
                              onOpenPicker={this.toggleDatePicker(!isLarge)}
                              onClosePicker={this.toggleDatePicker(false)}/>
                <PageContent>
                    <NoSsr>
                        {isLarge &&
                        <Drawer variant="permanent" classes={{paper: classes.drawer}}>
                            <DatePicker/>
                        </Drawer>}
                    </NoSsr>
                    <SwipeableTimeview/>
                </PageContent>
            </Page>
        );
    }
}