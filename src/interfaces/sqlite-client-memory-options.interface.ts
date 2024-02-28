import { SqliteClientCommonOptions } from "./sqlite-client-common-options.interface";

export interface SqliteClientMemoryOptions extends SqliteClientCommonOptions {
  flags: string,
}
