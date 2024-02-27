import { ExecuteSqlMessage } from "./messages/execute-sql.message";
import { CreateDatabaseOpfsMessage } from "./messages/create-database.opfs.message";
import { SqliteMessageInterface } from "./interfaces/sqlite-message.interface";
import { SqliteClientType, SqliteMessageTypeEnum } from "./enums/sqlite-message-type.enum";
import { ExecuteSqlResultMessage } from "./messages/execute-sql-result.message";
import { CreateDatabaseResultMessage } from "./messages/create-database-result.message";
import { CreateDatabaseOpfsSahMessage } from "./messages/create-database.opfsSah.message";

export interface SqliteClientCommonOptions {
  filename: string,
}

export interface SqliteClientProxyOptions extends SqliteClientCommonOptions {
  sqliteWorkerPath: string,
}

export interface SqliteClientOpfsOptions extends SqliteClientProxyOptions {
  flags: string,
}

export interface SqliteClientOpfsSahOptions extends SqliteClientProxyOptions {
  /**
   * If truthy (default=false) contents and filename mapping are removed from
   * each SAH it is acquired during initalization of the VFS, leaving the
   * VFS's storage in a pristine state. Use this only for databases which need
   * not survive a page reload.
   */
  clearOnInit?: boolean;

  /**
   * (default=6) Specifies the default capacity of the VFS.
   *
   * This should not be set unduly high because the VFS has to open (and keep
   * open) a file for each entry in the pool. This setting only has an effect
   * when the pool is initially empty. It does not have any effect if a pool
   * already exists. Note that this number needs to be at least twice the
   * number of expected database files (to account for journal files) and may
   * need to be even higher than three times the number of databases plus one,
   * depending on the value of the `TEMP_STORE` pragma and how the databases
   * are used.
   */
  initialCapacity?: number;

  /**
   * (default="."+options.name) Specifies the OPFS directory name in which to
   * store metadata for the VFS.
   *
   * Only one instance of this VFS can use the same directory concurrently.
   * Using a different directory name for each application enables different
   * engines in the same HTTP origin to co-exist, but their data are invisible
   * to each other. Changing this name will effectively orphan any databases
   * stored under previous names. This option may contain multiple path
   * elements, e.g. "/foo/bar/baz", and they are created automatically. In
   * practice there should be no driving need to change this.
   *
   * **ACHTUNG:** all files in this directory are assumed to be managed by the
   * VFS. Do not place other files in this directory, as they may be deleted
   * or otherwise modified by the VFS.
   */
  directory?: string;

  /**
   * (default="opfs-sahpool") sets the name to register this VFS under.
   *
   * Normally this should not be changed, but it is possible to register this
   * VFS under multiple names so long as each has its own separate directory
   * to work from. The storage for each is invisible to all others. The name
   * must be a string compatible with `sqlite3_vfs_register()` and friends and
   * suitable for use in URI-style database file names.
   *
   * **ACHTUNG:** if a custom name is provided, a custom directory must also
   * be provided if any other instance is registered with the default
   * directory. No two instances may use the same directory. If no directory
   * is explicitly provided then a directory name is synthesized from the name
   * option.
   */
  name?: string;
}

export interface SqliteClientMemoryOptions extends SqliteClientOpfsOptions {
  // tbd
}

export interface SqlitClientFactoryOptions {
  clientType: SqliteClientType,
  options: SqliteClientOpfsOptions | SqliteClientOpfsSahOptions | SqliteClientMemoryOptions,
}

export class SqliteClientFactory {

  public static getInstance(opts: SqlitClientFactoryOptions): SqliteClientBase {
    switch (opts.clientType) {
      case SqliteClientType.Opfs:
        return new SqliteClientOpfs(opts.options as SqliteClientOpfsOptions);
      case SqliteClientType.OpfsSah:
        return new SqliteClientOpfsSah(opts.options as SqliteClientOpfsSahOptions);
      default:
        return new SqliteClientMemory(opts.options as SqliteClientMemoryOptions);
    }
  }
}

export abstract class SqliteClientBase {
  public declare clientType: SqliteClientType;

  public abstract init(): any;

  public abstract getCreateDatabaseMessage(): SqliteMessageInterface;
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


  public executeSql(sqlStatement: string, bindParameters: (string | number)[] = []): Promise<any> {
    const executeSqlMessage = new ExecuteSqlMessage(sqlStatement, bindParameters);

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

  private
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
  constructor(options: SqliteClientMemoryOptions) {
    super(options);
    this.clientType = SqliteClientType.Memory;
  }
}

// backwards compatibility
export class SqliteClient extends SqliteClientOpfs {

};