import { SqliteMessageInterface } from "../interfaces/sqlite-message.interface";
import { SqliteMessageTypeEnum } from "../enums/sqlite-message-type.enum";
import { ExecuteSqlReturnValue } from "../enums/execute-sql-return-value.enum";
import { ExecuteSqlRowMode } from "../enums/execute-sql-row-mode.enum";

export class ExecuteSqlMessage implements SqliteMessageInterface {
  type: SqliteMessageTypeEnum = SqliteMessageTypeEnum.ExecuteSql;
  uniqueId: string = crypto.randomUUID();
  
  constructor(public readonly sqlStatement: string,
    public readonly bindingParameters: (string | number)[] = [],
    public readonly returnValue: ExecuteSqlReturnValue = ExecuteSqlReturnValue.resultRows,
    public readonly rowMode: ExecuteSqlRowMode = ExecuteSqlRowMode.array) {
  }
}