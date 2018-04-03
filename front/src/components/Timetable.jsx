import * as React from 'react';
import {connect} from 'react-redux';
import {addDays, addHours, compareAsc, format, isToday, startOfDay, startOfWeek} from "date-fns";
import frLocale from "date-fns/locale/fr";
import {CourseWrapper} from "./CourseWrapper";
import {Divider, Typography, withStyles} from "material-ui";

const DAY_MS = 1000*60*60*24;

const mapState = state => ({
	events: state.app.events,
	calendar: state.app.calendar,
	date: state.app.date,
    isPhone: state.responsive.isPhone,
	menu: state.app.menu
});

function setIntersection(a, b) {
	return a.some(ae => b.indexOf(ae) > -1) || b.some(be => a.indexOf(be) > -1);
}

function isLargerSet(a, b) {
	return a.length > b.length;
}

function collectGroups(events) {
	return events.reduce((conflicts, event, i, all) => {
		let inConflict = all.reduce((ids, e) => {
			let conflict = e.id !== event.id && (compareAsc(event.start, e.end) * compareAsc(event.end, e.start)) < 0;
			return conflict ? ids.concat([e.id]) : ids;
		}, []);
		if (inConflict.length > 0) {
			inConflict.push(event.id);
            conflicts = conflicts.length === 0 ? [inConflict] : conflicts
                .reduce((newConflicts, olderConflict) => {
                	return setIntersection(olderConflict, inConflict) && isLargerSet(inConflict, olderConflict) ?
						newConflicts : newConflicts.concat([olderConflict]);
				}, []);
            return conflicts.some(olderConflict => setIntersection(olderConflict, inConflict)) ?
				conflicts : conflicts.concat([inConflict]);
		} else {
			return conflicts.concat([[event.id]]);
		}
	}, []);
}

function mapEvents(events, offset, prefix) {
	let groups = collectGroups(events);
	let indexed = events.reduce((dict, event) => {
		return {...dict, [event.id]: event};
	}, {});
	return groups.map(group => {
		let eventGroup = group.map(id => indexed[id]);
		return <CourseWrapper key={`${prefix}_${group.reduce((s, id) => s + id, offset)}`} events={eventGroup} offset={offset} />
	});
}

@connect(mapState)
@withStyles(theme => ({
	root: {
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateRows: 'repeat(40, .7em)',
        gridGap: '.4em .4em',
        margin: '1em',
        [theme.breakpoints.down(767)]: {
            gridTemplateColumns: '1fr',
			gridGap: '.4em 0'
		}
	}
}))
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
		let offset = this.offset();
		return this.props.events
			.filter(e => e.start.valueOf() >= offset
				&& e.start.valueOf() < offset + this.days()*DAY_MS);
	}

	renderSeparators() {
		return Array.from({length: 10}, (x, i) => i).map(i => (
			<Divider key={`sep_${i}`} style={{gridRow: `${4*i+2} / span 4`, gridColumn: '1 / span 5'}} />
		));
	}

	renderDays() {
		return Array.from({length: this.days()}, (x, i) => i).map(i => {
            let date = addDays(this.date(), i);
            let today = isToday(date);
            let formatted = format(date, 'dddd DD/MM', {locale: frLocale});
            return (

                <Typography align="center" color={today ? 'primary' : 'textSecondary'} key={formatted} style={{gridColumn: i+1, gridRow: '1 / span 1'}}>
                    {formatted.toUpperCase()}
                </Typography>
            )
        })
	}

	renderEvents() {
		return mapEvents(this.events(), this.offset(), this.props.calendar);
	}

	render() {
		let classes = this.props.classes;
		return (
				<div className={classes.root}>
					{this.renderEvents()}
					{this.renderSeparators()}
                	{this.renderDays()}
				</div>

		);
	}

}