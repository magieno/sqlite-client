import { SqliteClientType } from "../enums/sqlite-client-type.enum";
import { SqliteMessageInterface } from "../interfaces/sqlite-message.interface";
import { CreateDatabaseOpfsSahMessage } from "../messages/create-database.opfsSah.message"; 
import { SqliteClientProxy } from "./sqlite-client-proxy";
import { SqliteClientProxyOpfsSahOptions } from "../interfaces/sqlite-client-proxy-opfs-sah-options.interface";


export class SqliteClientProxyOpfsSah extends SqliteClientProxy {

  private clearOnInit?: boolean;
  private initialCapacity?: number;
  private directory?: string;
  private name?: string;

  constructor(options: SqliteClientProxyOpfsSahOptions) {
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