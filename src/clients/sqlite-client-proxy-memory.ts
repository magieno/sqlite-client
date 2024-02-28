
import { SqliteMessageInterface } from "../interfaces/sqlite-message.interface";
import { Database, Sqlite3Static, default as sqlite3InitModule } from "@sqlite.org/sqlite-wasm"; 
import { CreateDatabaseMemoryMessage } from "../messages/create-database.memory.message";
import { SqliteClientProxy } from "./sqlite-client-proxy";
import { SqliteClientProxyMemoryOptions } from "../interfaces/sqlite-client-proxy-memory-options.interface";
import { SqliteClientType } from "../enums/sqlite-client-type.enum";
 
export class SqliteClientProxyMemory extends SqliteClientProxy {

  protected filename: string;
  protected flags: string; 

  protected sqlite3: Sqlite3Static | void;
  protected db: Database;

  constructor(options: SqliteClientProxyMemoryOptions) {
    super(options);
    this.clientType = SqliteClientType.MemoryWorker;
 
    this.flags = options.flags;
    this.filename = options.filename;
  }

  public getCreateDatabaseMessage(): SqliteMessageInterface {
    return new CreateDatabaseMemoryMessage(this.filename, this.flags);
  } 

} 