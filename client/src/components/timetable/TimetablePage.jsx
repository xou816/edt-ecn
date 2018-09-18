import React from 'react';
import {Timetable} from "./Timetable";
import {TimetableNav} from "./TimetableNav";
import {connect} from "react-redux";
import {LinearProgress, withStyles} from "@material-ui/core";
import {getCalendar} from "../../app/actions";
import {format, isSameDay, parse, startOfDay} from "date-fns";
import {compile} from "path-to-regexp";
import DatePickerDrawer from "./DatePickerDrawer";
import Media from "react-media";
import {Page, PageContent} from "../Page";

const mapState = state => ({
    loading: state.app.loading
});

const mapDispatch = dispatch => ({
    getCalendar: calendar => dispatch(getCalendar(calendar))
});

function makeLink(match) {
    let compiled = compile(match.path);
    return date => compiled({
        ...match.params,
        date: isSameDay(date, Date.now()) ?
            'today' :
            format(date, 'YYYYMMDD')
    });
}

@connect(mapState, mapDispatch)
export class TimetablePage extends React.Component {

    get calendar() {
        return this.props.match.params.calendar;
    }

    get date() {
        let date = this.props.match.params.date;
        return date !== 'today' ?
            parse(date, 'YYYYMMDD', Date.now()) :
            startOfDay(Date.now());
    }

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    toggleSidebar(open) {
        return () => this.setState({open});
    }

    componentDidMount() {
        let {getCalendar} = this.props;
        getCalendar(this.calendar);
    }

    render() {
        let date = this.date;
        let {loading, match} = this.props;
        let makeLinkForMatch = makeLink(match);
        return (
            <Media query={{screen: true, maxWidth: '797px'}}>
                {isPhone => <Page>
                    <TimetableNav date={date} makeLink={makeLinkForMatch} onDateClick={this.toggleSidebar(true)}/>
                    {loading ? <LinearProgress/> : null}
                    <Media query={{maxWidth: '1024px', minWidth: '767px'}}>
                        {isTablet =>
                            <PageContent>
                                <DatePickerDrawer permanent={!isPhone && !isTablet}
                                                  makeLink={makeLinkForMatch}
                                                  open={this.state.open}
                                                  onClose={this.toggleSidebar(false)}
                                                  date={date}/>
                                <Timetable days={isPhone ? 1 : 5}
                                           makeLink={makeLinkForMatch}
                                           date={date}/>
                            </PageContent>
                        }
                    </Media>
                </Page>}
            </Media>
        );
    }
}