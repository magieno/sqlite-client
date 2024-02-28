import { SqliteClientCommonOptions } from "./sqlite-client-common-options.interface";
  
  export interface SqliteClientProxyOptions extends SqliteClientCommonOptions {
    sqliteWorkerPath: string,
  }
   