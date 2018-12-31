import {createClient, RedisClient} from "redis";
import {parse} from "url";

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

export const redis = createRedisClient();