const ical = require('ical-generator');
const request = require('request-promise');
const libxmljs = require('libxmljs');
const moment = require('moment-timezone');

const MAX_BITS = 28;

const dateFromCourseTime = function(date, hour) {
	let parsed = hour.split(':').map((i) => parseInt(i, 10));
	let new_date = moment(date);
	new_date.hours(parsed[0]);
	new_date.minutes(parsed[1]);
	return new_date;
};

const safeGet = function(node, xpaths, fallback) {
	fallback = typeof fallback === 'undefined' ? '' : fallback;
	let res = '';
	xpaths.some(function(xpath) {
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
			.filter((node) => node.get('link').attr('href').value()[0] === 'p')
			.map((node) => {
				let name = node.get('name').text().split(',').shift();
				let id = node.get('link').attr('href').value().split('.').shift();
				return {
					id: id,
					name: name
				};
			});
	});
};

exports.getIdFromName = function(name) {
	return exports.listOnlineCalendars()
		.then((calendars) => calendars.find((cal) => cal.name.toLowerCase() === name.toLowerCase()))
		.then((cal) => cal.id);
};

exports.getOnlineCalendar = function(id) {
	const reg = /(\w+) \(\1\)/i;
	const url = 'http://website.ec-nantes.fr/sites/edtemps/' + id + '.xml';
	return request(url).then(function(body) {
		let doc = libxmljs.parseXml(body);
		let dates = [];
		doc.find('/timetable/span').map((node) => {
			let index = parseInt(node.get('title').text(), 10);
			dates[index] = node.find('day/date').map((date) => moment.tz(date, 'DD/MM/YYYY', 'Europe/Paris'));
		});
		return doc.find('//event')
			.map((node) => {
				let day = parseInt(node.get('day').text(), 10);
				let week = parseInt(node.get('prettyweeks').text(), 10);
				let date = dates[week][day];
				let description = safeGet(node, ['notes']);
				let subject = safeGet(node, ['resources/module/item', 'notes']).toUpperCase().split('-').shift();
				if (reg.test(subject)) {
					subject = subject.split(' ').shift();
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
					location: safeGet(node, ['resources/room/item']),
					description: description
				}
			})
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

exports.getCustomCalendar = function(id) {
	let filters = id.split('-');
	let calid = filters.shift();
	filters = filters.map((hex) => parseInt(hex, 16));
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

exports.createFilter = function(id, indices, count) {
	let filters = new Array(Math.floor(count/MAX_BITS) + 1);
	filters.fill(0);
	indices.forEach((index) => {
		let pos = Math.floor(index/MAX_BITS);
		let inc = 1 << (index%30);
		filters[pos] += inc;
	});
	return id + '-' + filters.map((index) => index.toString(16)).join('-');
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