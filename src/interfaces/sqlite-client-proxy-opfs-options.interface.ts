import { SqliteClientProxyOptions } from "./sqlite-client-proxy-options.interface";

export interface SqliteClientProxyOpfsOptions extends SqliteClientProxyOptions {
  flags: string,
}
