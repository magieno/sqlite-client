import { ExecuteSqlMessage } from "../messages/execute-sql.message";
import { CreateDatabaseOpfsMessage } from "../messages/create-database.opfs.message";
import { SqliteMessageInterface } from "../interfaces/sqlite-message.interface";
import { SqliteMessageTypeEnum } from "../enums/sqlite-message-type.enum";
import { ExecuteSqlResultMessage } from "../messages/execute-sql-result.message";
import { CreateDatabaseResultMessage } from "../messages/create-database-result.message"; 
import { SqliteClientBase } from "./sqlite-client-base";
import { SqliteClientProxyOptions } from "../interfaces/sqlite-client-proxy-options.interface";
import { ExecuteSqlReturnValue } from "../enums/execute-sql-return-value.enum";
import { ExecuteSqlRowMode } from "../enums/execute-sql-row-mode.enum";

/**
 * Worker based SQLite Client (OPFS & OPFS SAH & MEMORY if desired)
 * Will proxy the calls to the worker
 */
export class SqliteClientProxy extends SqliteClientBase {

  public getCreateDatabaseMessage(): SqliteMessageInterface {
    return new CreateDatabaseOpfsMessage(this.filename, "");
  }

  protected queuedPromises: { [hash in string]: { resolve: (...args) => void, reject: (...args) => void } } = {}

  protected worker: Worker;
  protected filename: string;
  protected sqliteWorkerPath: string;

  constructor(options: SqliteClientProxyOptions) {
    super(); // Call to the super class constructor
    this.filename = options.filename;
    this.sqliteWorkerPath = options.sqliteWorkerPath;
  }

  public async init() {
    this.worker = new Worker(this.sqliteWorkerPath, {
      type: "module", // You need module for the '@sqlite.org/sqlite-wasm' library.
    })
    this.worker.onmessage = this.messageReceived.bind(this);

    const createDatabaseMessage = this.getCreateDatabaseMessage();
    this.worker.postMessage(createDatabaseMessage);

    return new Promise<any>((resolve, reject) => {
      this.queuedPromises[createDatabaseMessage.uniqueId] = {
        resolve,
        reject,
      };
    });
  }

  private messageReceived(message: MessageEvent) {
    const sqliteMessage = message.data as SqliteMessageInterface;
    if (sqliteMessage.uniqueId !== undefined && this.queuedPromises.hasOwnProperty(sqliteMessage.uniqueId)) {
      const promise = this.queuedPromises[sqliteMessage.uniqueId];
      delete this.queuedPromises[sqliteMessage.uniqueId];

      switch (sqliteMessage.type) {
        case SqliteMessageTypeEnum.ExecuteSqlResult:
          const executeSqlResultMessage = sqliteMessage as ExecuteSqlResultMessage;

          if (executeSqlResultMessage.error) {
            return promise.reject(executeSqlResultMessage.error);
          }

          return promise.resolve(executeSqlResultMessage.result);
        case SqliteMessageTypeEnum.CreateDatabaseResult:
          const createDatabaseResultMessage = sqliteMessage as CreateDatabaseResultMessage;

          if (createDatabaseResultMessage.error) {
            return promise.reject(createDatabaseResultMessage.error);
          }

          return promise.resolve();
      }
    }
  }


  public executeSql(sqlStatement: string,
    bindParameters: (string | number)[] = [],
    returnValue: ExecuteSqlReturnValue = ExecuteSqlReturnValue.resultRows,
    rowMode: ExecuteSqlRowMode = ExecuteSqlRowMode.array): Promise<any> {

    const executeSqlMessage = new ExecuteSqlMessage(sqlStatement, bindParameters, returnValue, rowMode);

    this.worker.postMessage(executeSqlMessage);

    return new Promise<any>((resolve, reject) => {
      this.queuedPromises[executeSqlMessage.uniqueId] = {
        resolve,
        reject,
      };
    });
  }
}
 