import { SqliteClientType } from "./enums/sqlite-client-type.enum";
import { SqlitClientFactoryOptions } from "./interfaces/sqlite-client-factory-options.interface";
import { SqliteClientMemoryOptions } from "./interfaces/sqlite-client-memory-options.interface";
import { SqliteClientProxyMemoryOptions } from "./interfaces/sqlite-client-proxy-memory-options.interface";
import { SqliteClientProxyOpfsOptions } from "./interfaces/sqlite-client-proxy-opfs-options.interface";
import { SqliteClientProxyOpfsSahOptions } from "./interfaces/sqlite-client-proxy-opfs-sah-options.interface";

import { SqliteClientMemory } from "./clients/sqlite-client-memory";
import { SqliteClientProxyMemory } from "./clients/sqlite-client-proxy-memory";
import { SqliteClientProxyOpfs } from "./clients/sqlite-client-proxy-opfs";
import { SqliteClientProxyOpfsSah } from "./clients/sqlite-client-proxy-opfs-sah";

export class SqliteClientFactory {

  public static getInstance(opts: SqlitClientFactoryOptions): SqliteClientProxyOpfs | SqliteClientProxyOpfsSah | SqliteClientMemory | SqliteClientProxyMemory {
    switch (opts.clientType) {
      case SqliteClientType.Opfs:
        return new SqliteClientProxyOpfs(opts.options as SqliteClientProxyOpfsOptions);
      case SqliteClientType.OpfsSah:
        return new SqliteClientProxyOpfsSah(opts.options as SqliteClientProxyOpfsSahOptions);
      case SqliteClientType.MemoryMain:
        return new SqliteClientMemory(opts.options as SqliteClientMemoryOptions);
      case SqliteClientType.MemoryWorker:
        return new SqliteClientProxyMemory(opts.options as SqliteClientProxyMemoryOptions);
      default:
        throw new Error(`Unsupported SQLite Client Type: ${opts.clientType}`)
    }
  }
}
