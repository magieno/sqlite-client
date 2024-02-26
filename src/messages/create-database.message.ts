import {SqliteMessageInterface} from "../interfaces/sqlite-message.interface";
import {SqliteClientType, SqliteMessageTypeEnum} from "../enums/sqlite-message-type.enum";

export class CreateDatabaseMessage implements SqliteMessageInterface {
  type: SqliteMessageTypeEnum = SqliteMessageTypeEnum.CreateDatabase;
  clientTpye: SqliteClientType = SqliteClientType.Opfs;
  uniqueId: string = crypto.randomUUID();
  constructor(public readonly filename: string, public readonly flags: string) {
  }
}
