import { SqliteClientType } from "../enums/sqlite-client-type.enum";
import { SqliteClientBase } from "./sqlite-client-base"; 
 
import { SqliteClientMemoryOptions } from "../interfaces/sqlite-client-memory-options.interface";
import { Database, Sqlite3Static, default as sqlite3InitModule } from "@sqlite.org/sqlite-wasm";
import { ExecuteSqlReturnValue } from "../enums/execute-sql-return-value.enum";
import { ExecuteSqlRowMode } from "../enums/execute-sql-row-mode.enum";

export class SqliteClientMemory extends SqliteClientBase {

  protected filename: string;
  protected flags: string;

  protected sqlite3: Sqlite3Static | void;
  protected db: Database;

  constructor(options: SqliteClientMemoryOptions) {
    super();
    this.clientType = SqliteClientType.MemoryMain;

    this.flags = options.flags;
    this.filename = options.filename;
  }

  public getDB(): Database | undefined {
    return this.db;
  }

  public async init(): Promise<any> {
    this.sqlite3 = await sqlite3InitModule({
      print: console.log,
      printErr: console.error,
    });

    this.db = new this.sqlite3.oo1.DB(this.filename, this.flags);

  }

  public executeSql(sqlStatement: string,
    bindParameters: (string | number)[] = [],
    returnValue: ExecuteSqlReturnValue = ExecuteSqlReturnValue.resultRows,
    rowMode: ExecuteSqlRowMode = ExecuteSqlRowMode.array): any {

    return this.db.exec({
      sql: sqlStatement,
      bind: bindParameters,
      returnValue: returnValue as any, // todo i am no typescript ninja :-(
      rowMode: rowMode,
    });
  }

}