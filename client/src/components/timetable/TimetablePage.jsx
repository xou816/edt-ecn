import React from 'react';
import {TimetableNav} from "./TimetableNav";
import {connect} from "react-redux";
import {Drawer, withStyles} from "@material-ui/core";
import {getCalendar} from "../../app/actions";
import {Page, PageContent} from "../Page";
import {Media} from "../Media";
import DatePicker from "./DatePicker";
import timetableAware from "./timetableAware";
import SwipeableTimetable from "./SwipeableTimetable";


@timetableAware
@connect(state => ({count: state.app.events.length}),
    dispatch => ({getCalendar: calendar => dispatch(getCalendar(calendar))}))
@withStyles(theme => ({
    drawer: {
        position: 'relative',
        zIndex: 0,
        flexGrow: 0
    },
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

    componentWillMount() {
        let {getCalendar, count, calendar} = this.props;
        if (count === 0) {
            getCalendar(calendar);
        }
    }

    render() {
        let {calendar, date, classes, makeLink, weekView} = this.props;
        return (
            <Media queries={[{maxWidth: '797px'}, {maxWidth: '1024px', minWidth: '767px'}]}
                   serverMatchDevices={['mobile', 'tablet']}>
                {([isPhone, isTablet]) => (<Page>
                    <TimetableNav date={date}
                                  calendar={calendar}
                                  open={this.state.open && (isTablet || isPhone)}
                                  makeLink={makeLink}
                                  onOpenPicker={this.toggleDatePicker(isTablet || isPhone)}
                                  onClosePicker={this.toggleDatePicker(false)}/>
                    <PageContent>
                        {(isPhone || isTablet) ? <div/> :
                            <Drawer variant="permanent" classes={{paper: classes.drawer}}>
                                <DatePicker week={weekView} date={date} makeLink={makeLink}/>
                            </Drawer>}
                            <SwipeableTimetable/>
                    </PageContent>
                </Page>)}
            </Media>
        );
    }
}