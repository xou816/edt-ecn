import {createClient, RedisClient} from 'redis';
import {parse} from 'url';
import {createHash} from 'crypto';

function createRedisClient(): RedisClient {
    if (process.env.REDISTOGO_URL != null) {
        const rtg = parse(process.env.REDISTOGO_URL!);
        if (rtg.port != null && rtg.hostname != null && rtg.auth != null) {
            let redis: RedisClient = createClient(parseInt(rtg.port, 10), rtg.hostname, {});
            redis.auth(rtg.auth.split(':')[1]);
            return redis;
        }
    }
    return createClient();
}

const redis = createRedisClient();

const hashPin = (alias: string, pin: string): string => createHash('sha1').update(alias + pin).digest('hex');

function getAlias(alias: string): Promise<{ hash: string }> {
    return new Promise((resolve, reject) => {
        redis.hgetall(alias, (err, res) => {
            if (err) reject(err);
            resolve(res as { hash: string });
        });
    });
}

export function aliasExists(alias: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        redis.exists(alias, (err, res) => {
            if (err) reject(err);
            resolve(res > 0);
        });
    });
}

export function getCalId(alias: string): Promise<string> {
    return new Promise((resolve, reject) => {
        redis.hget(alias, 'value', (err, res) => {
            if (err || res === null) reject(err);
            resolve(res);
        });
    });
}

export function setAlias(alias: string, pin: string, value: string): Promise<boolean> {
    let hash = hashPin(alias, pin);
    let setAliasPromise: Promise<boolean> = new Promise((resolve, reject) => {
        redis.hmset(alias,
            {hash: hash, value: value},
            (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
    });
    return getAlias(alias)
        .then(doc => doc !== null && hash === doc.hash || doc === null ?
            Promise.resolve() : Promise.reject('Hash mismatch'))
        .then(_ => setAliasPromise);
}

export function setAliasNoPass(alias: string, value: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        redis.hmset(alias,
            {value: value},
            (err, res) => {
                if (err) reject(err);
                return resolve(res);
            });
    });
}