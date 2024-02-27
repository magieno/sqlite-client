import { SqliteMessageInterface } from "../interfaces/sqlite-message.interface";
import { SqliteMessageTypeEnum } from "../enums/sqlite-message-type.enum";

export enum ExecuteSqlReturnValue {
  /** default, return database instance, use for fluent calls */
  this = "this",
  /** return values of `resultRows` array (set to empty array if not set by user) */
  resultRows = "resultRows",
  /** return values of `saveSql` option (set to empty array if not set by user) */
  saveSql = "saveSql",
}

export enum ExecuteSqlRowMode {
  /** Array of column values for every result row */
  array = "array",
  /** Object mapping column names to values for every result row */
  object = "object",
  /** Only for use with `callback` option, pass  {@link PreparedStatement} object for every row. */
  stmt = "stmt",
  /** Extract column with (zero-based) index from every result row */
  number = "number",
  /** Extract column with name from every result row, must have format `$<column>`, with `column` having at least two characters.*/
  string = "string",

}
export class ExecuteSqlMessage implements SqliteMessageInterface {
  type: SqliteMessageTypeEnum = SqliteMessageTypeEnum.ExecuteSql;
  uniqueId: string = crypto.randomUUID();
  constructor(public readonly sqlStatement: string,
    public readonly bindingParameters: (string | number)[] = [],
    public readonly returnValue: ExecuteSqlReturnValue = ExecuteSqlReturnValue.resultRows,
    public readonly rowMode: ExecuteSqlRowMode = ExecuteSqlRowMode.array) {
  }
}