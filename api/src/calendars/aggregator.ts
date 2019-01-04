import {CelcatCalendar, CelcatCalendarType} from './celcat';
import {Calendar, CalendarId} from "../types";
import {RedisClient} from 'redis';
import {tz} from 'moment-timezone';

const LIST_KEY = (type: CelcatCalendarType) => `agg:list:${type}`;
const CALENDAR_KEY = (id: string) => `agg:calendar:${id}`;
const CACHE_DURATION = 3600;

export default class CalendarAggregator {

    private calendars: Array<CelcatCalendar>;
    private redis: RedisClient;

    constructor(calendars: Array<CelcatCalendar>, redis: RedisClient) {
        this.calendars = calendars;
        this.redis = redis;
    }

    private listFromRedis(type: CelcatCalendarType): Promise<Array<CalendarId>> {
        const promise = new Promise<string>((resolve, reject) => {
            this.redis.get(LIST_KEY(type), (err, res) => {
                err ? reject(err) : resolve(res);
            });
        });
        return promise
            .then(res => res === null ? [] : JSON.parse(res));
    }

    private async listFromCelcat(type: CelcatCalendarType): Promise<Array<CalendarId>> {
        let fresh = await Promise.all(this.calendars.map(celcat => celcat.listCalendars(type)));
        return fresh.reduce((fullList, current) => fullList.concat(current), []);
    }

    private cacheList(type: CelcatCalendarType, fresh: Array<CalendarId>): Promise<Array<CalendarId>> {
        const promise = new Promise<void>((resolve, reject) => {
            this.redis.setex(LIST_KEY(type), CACHE_DURATION, JSON.stringify(fresh), err => {
                err ? reject(err) : resolve();
            });
        });
        return promise.then(_ => fresh);
    }

    async listCalendars(type: CelcatCalendarType): Promise<Array<CalendarId>> {
        let cached = await this.listFromRedis(type);
        if (cached.length === 0) {
            console.log(`SET ${LIST_KEY(type)}`);
            let fresh = await this.listFromCelcat(type);
            return this.cacheList(type, fresh);
        } else {
            console.log(`GET ${LIST_KEY(type)}`);
            return cached;
        }
    }

    private async getFromRedis(id: string): Promise<Calendar|null> {
        const promise = new Promise<string>((resolve, reject) => {
            this.redis.get(CALENDAR_KEY(id), (err, res) => {
                err ? reject(err) : resolve(res);
            });
        });
        let res = await promise;
        if (res === null) {
            return res;
        } else {
            let parsed: Calendar<string> = JSON.parse(res);
            let events = parsed.events.map(event => ({
                ...event,
                start: tz(event.start!, 'UTC'),
                end: tz(event.end!, 'UTC')
            }));
            return {...parsed, events};
        }
    }

    private async cacheCalendar(id: string, fresh: Calendar): Promise<Calendar> {
        let calendar = {
            ...fresh,
            extra: {...fresh.extra, cached: Date.now()},
        };
        let stringified = JSON.stringify({
            ...calendar,
            events: fresh.events.map(event => ({
                ...event,
                start: event.start!.tz('UTC').format(),
                end: event.end!.tz('UTC').format()
            }))
        });
        const promise = new Promise<void>((resolve, reject) => {
            this.redis.setex(CALENDAR_KEY(id), CACHE_DURATION, stringified, err => {
                err ? reject(err) : resolve();
            });
        });
        return promise.then(_ => calendar);
    }

    private getFromCelcat(id: string): Promise<Calendar> {
        let provider = this.calendars.find(celcat => celcat.hasCalendar(id))!;
        return provider.getCalendar(id);
    }

    async getCalendar(id: string): Promise<Calendar> {
        let cached = await this.getFromRedis(id);
        if (cached === null) {
            console.log(`SET ${CALENDAR_KEY(id)}`);
            let fresh = await this.getFromCelcat(id);
            return this.cacheCalendar(id, fresh);
        } else {
            console.log(`GET ${CALENDAR_KEY(id)}`);
            return cached;
        }
    }
}