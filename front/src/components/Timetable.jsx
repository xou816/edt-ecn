import * as React from 'react';
import {connect} from 'react-redux';
import {addDays, addHours, startOfDay, startOfWeek, format, isToday} from "date-fns";
import frLocale from "date-fns/locale/fr";
import {Course} from "./Course";
import {eventId} from "../app/event";
import {Badge, Fade} from "reactstrap";

const DAY_MS = 1000*60*60*24;

const mapState = state => ({
	events: state.app.events,
	date: state.app.date,
    isPhone: state.responsive.isPhone,
    loading: state.app.loading
});

@connect(mapState)
export class Timetable extends React.Component {

	days() {
		return this.props.isPhone ? 1 : 5;
	}

	date() {
        let rawDate = this.props.date;
        return this.days() > 1 ? startOfWeek(rawDate, {weekStartsOn: 1}) : startOfDay(rawDate);
    }

	offset() {
		return addHours(this.date(), 8).valueOf();
	}

	events() {
		return this.props.events.filter(e => e.start.valueOf() >= this.offset()
			&& e.start.valueOf() < this.offset() + this.days()*DAY_MS);
	}

	render() {
		return (
			<div className="timetable">
				{this.events().map(event => <Course fade={!this.props.loading} key={eventId(event)} event={event} offset={this.offset()} />)}
                {Array.from({length: this.days()}, (x, i) => i).map(i => {
                    let date = addDays(this.date(), i);
                    let today = isToday(date);
                    let formatted = format(date, 'dddd DD/MM', {locale: frLocale});
                    return (
                        <Badge color={today ? 'primary' : 'light'} key={formatted} style={{gridColumn: i+1, gridRow: '1 / span 1'}}>
                            {formatted.toUpperCase()}
                        </Badge>
                    )
                })}
			</div>
		);
	}

}