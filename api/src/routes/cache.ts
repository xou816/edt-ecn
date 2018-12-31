import * as redisCache from 'express-redis-cache';
import {redis} from "../redis";

export const EXPIRE_RULES = {
    '2xx': 3600,
    '4xx': 10,
    '5xx': 10,
    'xxx': 3600
};

const cache = redisCache({
    client: redis,
    expire: 3600
});
cache.on('message', console.log);
cache.on('error', console.error);

export default cache;