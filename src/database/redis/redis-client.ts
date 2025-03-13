import { createClient, RedisClientType } from "redis"

export default class RedisClient {
  client: RedisClientType
  constructor(config: { url: string, name?: string, password: string, autoConnect?: boolean },) {
    this.client = createClient({ url: config.url, password: config.password })
    this.logs(config?.name || "main", config?.autoConnect)
  }
  private logs(name: string, autoConnect?: boolean) {
    autoConnect ? this.client.connect() : {}
    this.client.on('connect', function () {
      console.log(`${name} Redis Connected!`)
    })

    this.client.on('ready', function () {
      console.log(`${name} Redis is ready!`)
    })
    this.client.on('error', (error: Error) =>
      console.log(`${name} Redis error!`, error)
    )
  }
}