import {SqliteMessageInterface} from "../interfaces/sqlite-message.interface";
import {SqliteMessageTypeEnum} from "../enums/sqlite-message-type.enum";
import {ReturnValueEnum} from "../enums/return-value.enum";
import {RowModeEnum} from "../enums/row-mode.enum";

export class ExecuteSqlMessage implements SqliteMessageInterface {
  type: SqliteMessageTypeEnum = SqliteMessageTypeEnum.ExecuteSql;
  uniqueId: string = crypto.randomUUID();
  constructor(public readonly sqlStatement: string,
              public readonly bindingParameters: (string|number)[] = [],
              public readonly returnValue: ReturnValueEnum,
              public readonly rowMode: RowModeEnum | number
              ) {
  }
}
