import {createHash} from 'crypto';
import {redis} from "./redis";

const hashPin = (alias: string, pin: string): string => createHash('sha1').update(alias + pin).digest('hex');

export function getAlias(alias: string): Promise<{ hash?: string, value: string }> {
    return new Promise((resolve, reject) => {
        redis.hgetall(alias, (err, res) => {
            if (err) reject(err);
            if (res === null) reject();
            resolve(res as { hash: string, value: string });
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

export function setAlias(alias: string, pin: string, value: string): Promise<boolean> {
    let hash = hashPin(alias, pin);
    let setAliasPromise: Promise<boolean> = new Promise((resolve, reject) => {
        redis.hmset(alias,
            {hash: hash, value: value},
            (err, res) => {
                if (err) reject(err);
                resolve(true);
            });
    });
    return getAlias(alias)
        .then(doc => hash === doc.hash)
        .then(_ => setAliasPromise);
}

export function setAliasNoPass(alias: string, value: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        redis.hmset(alias,
            {value: value},
            (err, res) => {
                if (err) reject(err);
                return resolve(true);
            });
    });
}