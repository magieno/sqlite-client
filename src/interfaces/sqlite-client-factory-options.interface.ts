 
import { SqliteClientType } from "../enums/sqlite-client-type.enum";
import { SqliteClientMemoryOptions } from "./sqlite-client-memory-options.interface";
import { SqliteClientProxyMemoryOptions } from "./sqlite-client-proxy-memory-options.interface";
import { SqliteClientProxyOpfsOptions } from "./sqlite-client-proxy-opfs-options.interface";
import { SqliteClientProxyOpfsSahOptions } from "./sqlite-client-proxy-opfs-sah-options.interface";

export interface SqlitClientFactoryOptions {
  clientType: SqliteClientType,
  options: SqliteClientProxyOpfsOptions | SqliteClientProxyOpfsSahOptions | SqliteClientProxyMemoryOptions | SqliteClientMemoryOptions,
}