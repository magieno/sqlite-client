
import { ExecuteSqlReturnValue } from "../enums/execute-sql-return-value.enum";
import { ExecuteSqlRowMode } from "../enums/execute-sql-row-mode.enum";
import { SqliteClientType } from "../enums/sqlite-client-type.enum"; 

export abstract class SqliteClientBase {
  public declare clientType: SqliteClientType;

  public abstract init(): any;
  public abstract executeSql(sqlStatement: string,
    bindParameters?: (string | number)[],
    returnValue?: ExecuteSqlReturnValue,
    rowMode?: ExecuteSqlRowMode): Promise<any>;
}