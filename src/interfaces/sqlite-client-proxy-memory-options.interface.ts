import { SqliteClientProxyOptions } from "./sqlite-client-proxy-options.interface";

export interface SqliteClientProxyMemoryOptions extends SqliteClientProxyOptions {
  flags: string,
}
