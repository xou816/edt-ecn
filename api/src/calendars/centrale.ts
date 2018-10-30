import {CelcatCalendar, CelcatEvent} from "./celcat";
import {UNKNOWN_SUBJECT} from "../types";
import {CalendarEvent, CalendarId} from "../types";

const ECN_COURSE_NAME = /^([A-Z0-9_]+) \(([A-Za-zÀ-ÿ0-9 ]+)\)/;
const ECN_ROOM_REGEX = /^([\w ]+) \(\1\)$/i;

function prettyName(category: string, full_subject: string, description: string): string {
    let possibleNames = [`${category} ${full_subject === UNKNOWN_SUBJECT ? '' : full_subject}`, `${description}`]
        .map(s => s.trim())
        .filter(s => s.length > 0);
    return possibleNames.shift() || '';
}

export class CentraleCalendar extends CelcatCalendar {

    mapCalendarName(name: string): { name: string; display: string } {
        const result = name.split(', ')
        return {name: result[0], display: result[1]};
    }

    mapEvent(event: CelcatEvent): CalendarEvent {

        let res;

        // Subjects are formatted as 'ACRONYM (Acronym explained)'
        let full_subject;
        res = ECN_COURSE_NAME.exec(event.subject);
        if (res !== null) {
            event.subject = res[1];
            full_subject = res[2];
        } else {
            full_subject = event.subject;
        }

        // Location names are often redundant 'C001 (C001)'
        event.location = event.location.map(location => {
            res = ECN_ROOM_REGEX.exec(location);
            return res !== null ? res[1] : location;
        });

        let pretty = prettyName(event.category, full_subject, event.description);

        return {...event, full_subject, pretty};
    }

    prefix(): string {
        return '';
    }

    url(): string {
        return 'http://website.ec-nantes.fr/sites/edtemps';
    }

    filterCalendars(calendar: CalendarId): boolean {
        return true;
    }

    timezone() {
        return 'Europe/Paris';
    }

}

export default new CentraleCalendar();