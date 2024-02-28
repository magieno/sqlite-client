import { SqliteClientType } from "../enums/sqlite-client-type.enum";
import { CreateDatabaseOpfsMessage } from "../messages/create-database.opfs.message";
import { SqliteMessageInterface } from "../interfaces/sqlite-message.interface";
 
import { SqliteClientProxy } from "./sqlite-client-proxy";
import { SqliteClientProxyOptions } from "../interfaces/sqlite-client-proxy-options.interface";
import { SqliteClientProxyOpfsOptions } from "../interfaces/sqlite-client-proxy-opfs-options.interface";


export class SqliteClientProxyOpfs extends SqliteClientProxy {

  protected flags: string;

  // Overload constructor signatures
  constructor(options: SqliteClientProxyOpfsOptions);
  constructor(filename: string, flags: string, sqliteWorkerPath: string);

  constructor(...args: any[]) {
    const options: SqliteClientProxyOptions = {
      filename: "",
      sqliteWorkerPath: "",
    }
    let flags = "";
    // Determine if the first argument is an object (new way)
    if (typeof args[0] === 'object' && args[0] !== null) {
      const opfsOptions = args[0] as SqliteClientProxyOpfsOptions;
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