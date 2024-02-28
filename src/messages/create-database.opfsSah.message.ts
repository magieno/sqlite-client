import { SqliteMessageInterface } from "../interfaces/sqlite-message.interface";
import { SqliteMessageTypeEnum } from "../enums/sqlite-message-type.enum";
import { SqliteClientType } from "../enums/sqlite-client-type.enum";
export class CreateDatabaseOpfsSahMessage implements SqliteMessageInterface {
  type: SqliteMessageTypeEnum = SqliteMessageTypeEnum.CreateDatabase;
  clientType: SqliteClientType = SqliteClientType.OpfsSah;
  uniqueId: string = crypto.randomUUID();
  
  constructor(public readonly filename: string, public readonly clearOnInit?: boolean, public readonly initialCapacity?: number, public readonly directory?: string, public readonly name?: string) {
  }
}