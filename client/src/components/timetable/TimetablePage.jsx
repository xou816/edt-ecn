import React from 'react';
import {Timetable} from "./Timetable";
import {TimetableNav} from "./TimetableNav";
import {connect} from "react-redux";
import {Drawer, withStyles} from "@material-ui/core";
import {getCalendar} from "../../app/actions";
import {format, isSameDay, parse, startOfDay} from "date-fns";
import {compile} from "path-to-regexp";
import {Page, PageContent} from "../Page";
import {Media} from "../Media";
import DatePicker from "./DatePicker";

function makeLink(match) {
    let compiled = compile(match.path);
    return date => compiled({
        ...match.params,
        date: isSameDay(date, Date.now()) ?
            'today' :
            format(date, 'RRRRMMDD')
    });
}

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

    get calendar() {
        return this.props.match.params.calendar;
    }

    get date() {
        let date = this.props.match.params.date;
        return date !== 'today' ?
            parse(date, 'RRRRMMDD', Date.now()) :
            startOfDay(Date.now());
    }

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
        let {getCalendar, count} = this.props;
        if (count === 0) {
            getCalendar(this.calendar);
        }
    }

    render() {
        let date = this.date;
        let {match, classes} = this.props;
        let makeLinkForMatch = makeLink(match);
        return (
            <Media queries={[{maxWidth: '797px'}, {maxWidth: '1024px', minWidth: '767px'}]}
                   serverMatchDevices={['mobile', 'tablet']}>
                {([isPhone, isTablet]) => (<Page>
                    <TimetableNav date={date}
                                  calendar={this.calendar}
                                  open={this.state.open}
                                  makeLink={makeLinkForMatch}
                                  onOpenPicker={this.toggleDatePicker(isTablet || isPhone)}
                                  onClosePicker={this.toggleDatePicker(false)} />
                    <PageContent>
                        {(isPhone || isTablet) ? <div/> :
                            <Drawer variant="permanent" classes={{paper: classes.drawer}}>
                                <DatePicker week={!isPhone} date={date} makeLink={makeLinkForMatch}/>
                            </Drawer>}
                        <Timetable days={isPhone ? 1 : 5}
                                   makeLink={makeLinkForMatch}
                                   date={date}/>
                    </PageContent>
                </Page>)}
            </Media>
        );
    }
}