import * as React from 'react';
import {connect} from 'react-redux';
import {addDays, addHours, startOfDay, startOfWeek, format, isToday, compareAsc} from "date-fns";
import frLocale from "date-fns/locale/fr";
import {Course} from "./Course";
import {eventId} from "../app/event";
import {Badge, Fade} from "reactstrap";

const DAY_MS = 1000*60*60*24;

const mapState = state => ({
	events: state.app.events,
	date: state.app.date,
    isPhone: state.responsive.isPhone
});

function setInclusion(a, b) {
	return a.every(ae => b.indexOf(ae) > -1);
}

function collectConflicts(events) {
	return events.reduce((conflicts, event, i, all) => {
		let ids = all.reduce((ids, e) => {
			let bool = eventId(e) !== eventId(event) && (compareAsc(event.start, e.end) * compareAsc(event.end, e.start)) < 0;
			return bool ? ids.concat([eventId(e)]) : ids;
		}, []);
		if (ids.length > 0) {
			ids.push(eventId(event));
			conflicts = conflicts.length == 0 ? [ids] : conflicts
				.filter(conflict => !setInclusion(ids, conflict));
			return conflicts.concat(conflicts.some(conflict => setInclusion(conflict, ids)) ? [] : [ids]);
		} else {
			return conflicts;
		}
	}, []);
}

function mapEvents(events, target) {
	let conflicts = collectConflicts(events);
	return events.map(event => {
		let id = eventId(event);
		let elementProps = {
			key: id,
			event: event,
			stack: 0
		};
		let index = conflicts.reduce((index, conflict) => {
			let offset = conflict.indexOf(target) + 1;
			return Math.max((conflict.indexOf(id) - offset)%conflict.length, index);
		}, -1);
		if (index > 0) {
			elementProps.stack = index;
		}
		return elementProps;
	});
}

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

	renderSeparators() {
		return Array.from({length: 10}, (x, i) => i).map(i => (
			<div key={`separator_${i}`} style={{gridRow: `${4*i+2} / span 4`}} className='separator' />
		));
	}

	renderDays() {
		return Array.from({length: this.days()}, (x, i) => i).map(i => {
            let date = addDays(this.date(), i);
            let today = isToday(date);
            let formatted = format(date, 'dddd DD/MM', {locale: frLocale});
            return (
                <Badge color={today ? 'primary' : 'light'} key={formatted} style={{gridColumn: i+1, gridRow: '1 / span 1'}}>
                    {formatted.toUpperCase()}
                </Badge>
            )
        })
	}

	renderEvents() {
		return mapEvents(this.events())
			.map(props => <Course {...props} offset={this.offset()} />)
	}

	render() {
		return (
			<div className="timetable">
				{this.renderEvents()}
				{this.renderSeparators()}
                {this.renderDays()}
			</div>
		);
	}

}