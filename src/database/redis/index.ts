import RedisClient from "./redis-client"

const redis1 = new RedisClient({
    url: `${process.env.REDIS_URL}:${process.env.REDIS_PORT}/${process.env?.REDIS_DB || 0}`,
    password: process?.env?.REDIS_PASSWORD || "",
    name: "common-redis",
    autoConnect: false
}).client

export { redis1 }

export default {
    redis1
}