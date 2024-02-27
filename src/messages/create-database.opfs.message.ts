import {SqliteMessageInterface} from "../interfaces/sqlite-message.interface";
import {SqliteClientType, SqliteMessageTypeEnum} from "../enums/sqlite-message-type.enum";

export class CreateDatabaseOpfsMessage implements SqliteMessageInterface {
  type: SqliteMessageTypeEnum = SqliteMessageTypeEnum.CreateDatabase;
  clientType: SqliteClientType = SqliteClientType.Opfs;
  uniqueId: string = crypto.randomUUID();
  constructor(public readonly filename: string, public readonly flags: string) {
  }
}
