import { SqliteMessageInterface } from "../interfaces/sqlite-message.interface";
import { SqliteMessageTypeEnum } from "../enums/sqlite-message-type.enum";
import { SqliteClientType } from "../enums/sqlite-client-type.enum";

export class CreateDatabaseMemoryMessage implements SqliteMessageInterface {
  type: SqliteMessageTypeEnum = SqliteMessageTypeEnum.CreateDatabase;
  clientType: SqliteClientType = SqliteClientType.MemoryWorker;
  uniqueId: string = crypto.randomUUID();
  
  constructor(public readonly filename: string, public readonly flags: string) {
  }
}
