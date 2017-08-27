const ical = require('ical-generator');
const request = require('request-promise');
const libxmljs = require('libxmljs');
const moment = require('moment-timezone');

const TARGET_BASE = 32;
const MAX_BITS = 28;
const STR_LEN = Math.ceil(MAX_BITS/Math.log2(TARGET_BASE));
const zeroPad = rep => {
	let len = rep.length;
	let cat = '0'.repeat(STR_LEN) + rep;
	return cat.substr(len, len + STR_LEN);
};

const FILTER = 'Groupe';

const dateFromCourseTime = function(date, hour) {
	let parsed = hour.split(':').map((i) => parseInt(i, 10));
	let new_date = moment(date);
	new_date.hours(parsed[0]);
	new_date.minutes(parsed[1]);
	return new_date;
};

const safeGet = function(node, xpaths, fallback) {
	fallback = typeof fallback === 'undefined' ? '' : fallback;
	let res = fallback;
	xpaths.some((xpath) => {
		try {
			res = node.get(xpath).text();
			return true;
		} catch (e) {
			return false;
		}
	});
	return res;
};

exports.listOnlineCalendars = function() {
	let url = 'http://website.ec-nantes.fr/sites/edtemps/finder.xml';
	return request(url).then(function(body) {
		let doc = libxmljs.parseXml(body);
		return doc.find('/finder/resource')
			.filter((node) => node.get('link').attr('href').value()[0] === FILTER[0].toLowerCase())
			.map((node) => {
				let names = node.get('name').text().split(',');
				let id = node.get('link').attr('href').value().split('.').shift();
				return {
					id: id,
					name: names[0].trim(),
					display: typeof names[1] !== 'undefined' ? names[1].trim() : ''
				};
			});
	});
};

exports.getIdFromName = function(name) {
	return exports.listOnlineCalendars()
		.then((calendars) => calendars.find((cal) => cal.name.toLowerCase() === name.toLowerCase()))
		.then((cal) => cal.id);
};

const mapNodeToCalendar = function(node, dates) {
	const reg = /(\w+) \(\1\)/i;
	let day = parseInt(node.get('day').text(), 10);
	let week = parseInt(node.get('prettyweeks').text(), 10);
	let date = dates[week][day];
	let description = safeGet(node, ['notes']);
	let subject = safeGet(node, ['resources/module/item', 'notes']).split('-').shift();
	if (reg.test(subject)) {
		subject = subject.split(' ').shift();
	}
	let location = safeGet(node, ['resources/room/item']);
	if (reg.test(location)) {
		location = location.split(' ').shift();
	}
	if (subject == 'LVC') {
		subject = description.toUpperCase().split('-').shift();
		if (subject.trim() == '') subject = 'LVC';
	}
	subject = subject.trim();
	let full_subject = safeGet(node, ['category']) + ' ' + subject;
	return {
		start: dateFromCourseTime(date, node.get('starttime').text()),
		end: dateFromCourseTime(date, node.get('endtime').text()),
		subject: subject,
		full_subject: full_subject.trim(),
		location: location,
		// description: description
	}
}

exports.getOnlineCalendar = function(id) {
	const url = 'http://website.ec-nantes.fr/sites/edtemps/' + id + '.xml';
	return request(url).then(function(body) {
		let doc = libxmljs.parseXml(body);
		let dates = [];
		doc.find('/timetable/span').map((node) => {
			let index = parseInt(node.get('title').text(), 10);
			dates[index] = node.find('day/date').map((date) => moment.tz(date, 'DD/MM/YYYY', 'Europe/Paris'));
		});
		return doc.find('//event')
			.map(node => mapNodeToCalendar(node, dates))
			.sort((a, b) => a.start - b.start);
	});
};

exports.getSubjects = function(events) {
	return events
		.map((e) => e = { subject: e.subject, date: e.start })
		.sort((a, b) => {
			let bool = a.subject < b.subject || a.subject == b.subject && a.date < b.date
			return bool ? -1 : 1;
		})
		.filter((e, pos, arr) => (e.subject.length && (!pos || e.subject != arr[pos - 1].subject)))
		.sort((a, b) => (a.date < b.date ? -1 : 1))
		.reduce((final, e, index) => {
			final[e.subject] = index;
			return final;
		}, {});
};

const getSimpleCustomCalendar = function(id) {
	const reg = new RegExp('.{' + STR_LEN + '}', 'g');
	let [calid, filter] = id.split('-');
	if (typeof filter === 'undefined') {
		return exports.getOnlineCalendar(calid);
	}
	filters = filter.match(reg).map((hex) => parseInt(hex, TARGET_BASE));
	return exports.getOnlineCalendar(calid)
		.then((events) => {
			let subjects = exports.getSubjects(events);
			return events.filter((event) => {
				let pos = subjects[event.subject];
				let filter = filters[Math.floor(pos/MAX_BITS)];
				filter = (typeof filter === 'undefined') ? 0 : filter;
				let bin = (1 << (pos%MAX_BITS)) & filter;
				return bin == 0;
			});
		});
};

exports.getCustomCalendar = function(id) {
	return Promise.all(id
			.split('+')
			.map(getSimpleCustomCalendar))
		.then(all => all.reduce((acc, events) => acc.concat(events), []));
};

exports.createFilter = function(id, indices) {
	let max = Math.max.apply(null, indices) + 1;
	let filters = new Array(Math.ceil(max/MAX_BITS));
	filters.fill(0);
	indices.forEach(index => {
		let pos = Math.floor(index/MAX_BITS);
		let inc = 1 << (index%MAX_BITS);
		filters[pos] += inc;
	});
	return id + '-' + filters
		.map(num => zeroPad(num.toString(TARGET_BASE)))
		.join('');
};

exports.calendarToIcs = function(events) {
	let cal = ical({
        domain: 'ec-nantes.fr',
        name: 'EDT',
        timezone: 'Europe/Paris',
        prodId: { company: 'ec-nantes.fr', product: 'edt' },
    });
	events.forEach((course) => {
		cal.createEvent({
			start: course.start.tz('UTC').toDate(),
			end: course.end.tz('UTC').toDate(),
			summary: course.full_subject,
			description: course.description,
			location: course.location
		});
    });
    return cal.toString();
};