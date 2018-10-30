import {CelcatCalendar, CelcatEvent} from "./celcat";
import {UNKNOWN_SUBJECT} from "../types";
import {CalendarEvent, CalendarId} from "../types";

const UFR_CAL_NAME = /^([A-Za-zÀ-ÿ0-9 ]+), X[A-Z0-9]+$/;
const UFR_COURSE_NAME = /^([A-Za-zÀ-ÿ0-9 ]+) \(X[A-Z0-9]+\)$/;

function prettyName(category: string, subject: string, description: string): string {
    let possibleNames = [`${category} ${subject === UNKNOWN_SUBJECT ? '' : subject}`, `${description}`]
        .map(s => s.trim())
        .filter(s => s.length > 0);
    return possibleNames.shift() || '';
}

export class UFRCalendar extends CelcatCalendar {

    mapCalendarName(name: string): { name: string; display: string } {
        const result = UFR_CAL_NAME.exec(name);
        if (result !== null) {
            return {name: result[1], display: result[1]};
        } else {
            return {name, display: name};
        }
    }

    mapEvent(event: CelcatEvent): CalendarEvent {

        let res;

        // Subjects are formatted as 'Foobar, X00000'
        let full_subject;
        res = UFR_COURSE_NAME.exec(event.subject);
        if (res !== null) {
            event.subject = res[1];
            full_subject = res[1];
        } else {
            full_subject = event.subject;
        }

        // Some categories have a prefix: 'TD math'
        event.category = event.category.replace(' math', '');

        let pretty = prettyName(event.category, event.subject, event.description);

        return {...event, full_subject, pretty};
    }

    prefix(): string {
        return 'ufr:';
    }

    url(): string {
        return 'https://edt.univ-nantes.fr/sciences';
    }

    filterCalendars(calendar: CalendarId): boolean {
        return calendar.name.startsWith('M1ECN');
    }

    timezone() {
        return 'Europe/Paris';
    }

}

export default new UFRCalendar();