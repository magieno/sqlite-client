import { ExecuteSqlMessage, ExecuteSqlReturnValue, ExecuteSqlRowMode } from "./messages/execute-sql.message";
import { CreateDatabaseOpfsMessage } from "./messages/create-database.opfs.message";
import { SqliteMessageInterface } from "./interfaces/sqlite-message.interface";
import { SqliteClientType, SqliteMessageTypeEnum } from "./enums/sqlite-message-type.enum";
import { ExecuteSqlResultMessage } from "./messages/execute-sql-result.message";
import { CreateDatabaseResultMessage } from "./messages/create-database-result.message";
import { CreateDatabaseOpfsSahMessage } from "./messages/create-database.opfsSah.message";
import { Database, Sqlite3Static, default as sqlite3InitModule } from "@sqlite.org/sqlite-wasm";
import { SqlitClientFactoryOptions, SqliteClientMemoryOptions, SqliteClientOpfsOptions, SqliteClientOpfsSahOptions, SqliteClientProxyOptions } from "./interfaces/sqlite-client-options.interface";
import { CreateDatabaseMemoryMessage } from "./messages/create-database.memory.message";

export class SqliteClientFactory {

  public static getInstance(opts: SqlitClientFactoryOptions): SqliteClientOpfs | SqliteClientOpfsSah | SqliteClientMemory {
    switch (opts.clientType) {
      case SqliteClientType.Opfs:
        return new SqliteClientOpfs(opts.options as SqliteClientOpfsOptions);
      case SqliteClientType.OpfsSah:
        return new SqliteClientOpfsSah(opts.options as SqliteClientOpfsSahOptions);
      case SqliteClientType.Memory:
        return new SqliteClientMemory(opts.options as SqliteClientMemoryOptions);
      default:
        throw new Error(`Unsupported SQLite Client Type: ${opts.clientType}`)
    }
  }
}

export abstract class SqliteClientBase {
  public declare clientType: SqliteClientType;

  public abstract init(): any;
  public abstract executeSql(sqlStatement: string,
    bindParameters: (string | number)[],
    returnValue: ExecuteSqlReturnValue,
    rowMode: ExecuteSqlRowMode): Promise<any>;
}


/**
 * Worker based SQLite Client (OPFS & OPFS SAH)
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

export class SqliteClientOpfs extends SqliteClientProxy {

  protected flags: string;

  // Overload constructor signatures
  constructor(options: SqliteClientOpfsOptions);
  constructor(filename: string, flags: string, sqliteWorkerPath: string);

  constructor(...args: any[]) {
    const options: SqliteClientProxyOptions = {
      filename: "",
      sqliteWorkerPath: "",
    }
    let flags = "";
    // Determine if the first argument is an object (new way)
    if (typeof args[0] === 'object' && args[0] !== null) {
      const opfsOptions = args[0] as SqliteClientOpfsOptions;
      options.filename = opfsOptions.filename;
      options.sqliteWorkerPath = opfsOptions.sqliteWorkerPath;
      flags = opfsOptions.flags;
    } else {
      // Backward compatible way
      options.filename = args[0];
      flags = args[1];
      options.sqliteWorkerPath = args[2];
    }

    super(options);
    this.flags = flags;
    this.clientType = SqliteClientType.Opfs;
  }

  public getCreateDatabaseMessage(): SqliteMessageInterface {
    return new CreateDatabaseOpfsMessage(this.filename, this.flags);
  }
}

export class SqliteClientOpfsSah extends SqliteClientProxy {

  private clearOnInit?: boolean;
  private initialCapacity?: number;
  private directory?: string;
  private name?: string;

  constructor(options: SqliteClientOpfsSahOptions) {
    super(options);
    this.clientType = SqliteClientType.OpfsSah;
    this.clearOnInit = options.clearOnInit;
    this.initialCapacity = options.initialCapacity;
    this.directory = options.directory;
    this.name = options.name;
  }

  public getCreateDatabaseMessage(): SqliteMessageInterface {
    return new CreateDatabaseOpfsSahMessage(this.filename, this.clearOnInit, this.initialCapacity, this.directory, this.name);
  }

}

export class SqliteClientMemory extends SqliteClientProxy {

  protected filename: string;
  protected flags: string;
  protected useWorker?: boolean;

  protected sqlite3: Sqlite3Static | void;
  protected db: Database;

  constructor(options: SqliteClientMemoryOptions) {
    super(options);
    this.clientType = SqliteClientType.Memory;

    this.useWorker = options.useWorker;
    this.flags = options.flags;
    this.filename = options.filename;
  }

  public getCreateDatabaseMessage(): SqliteMessageInterface {
    // OPFS and Memory both only have filename and flags so just reuse OPFS as of now
    return new CreateDatabaseMemoryMessage(this.filename, this.flags);
  }

  public getDB(): Database | undefined {
    return this.db;
  }

  public async init(): Promise<any> {

    if (this.useWorker) {
      return super.init();
    } else {
      this.sqlite3 = await sqlite3InitModule({
        print: console.log,
        printErr: console.error,
      });

      this.db = new this.sqlite3.oo1.DB(this.filename, this.flags);
    }
  }

  public async executeSql(sqlStatement: string,
    bindParameters: (string | number)[] = [],
    returnValue: ExecuteSqlReturnValue = ExecuteSqlReturnValue.resultRows,
    rowMode: ExecuteSqlRowMode = ExecuteSqlRowMode.array): Promise<any> {
    if (this.useWorker) {
      return super.executeSql(sqlStatement, bindParameters, returnValue, rowMode);
    } else {
      return this.db.exec({
        sql: sqlStatement,
        bind: bindParameters,
        returnValue: returnValue as any, // to do i am no typescript ninja :-(
        rowMode: rowMode,
      });
    }
  }

}

// backwards compatibility
export class SqliteClient extends SqliteClientOpfs {

};