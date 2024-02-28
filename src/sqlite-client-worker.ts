import { SqliteClientType, SqliteMessageTypeEnum } from "./enums/sqlite-message-type.enum";
import { CreateDatabaseOpfsMessage } from "./messages/create-database.opfs.message";
import { SqliteMessageInterface } from "./interfaces/sqlite-message.interface";
import { CreateDatabaseResultMessage } from "./messages/create-database-result.message";
import { Database, OpfsDatabase, OpfsSAHPoolDatabase, SAHPoolUtil, default as sqlite3InitModule } from "@sqlite.org/sqlite-wasm";
import { ExecuteSqlMessage } from "./messages/execute-sql.message";
import { ExecuteSqlResultMessage } from "./messages/execute-sql-result.message";
import { CreateDatabaseOpfsSahMessage } from "./messages/create-database.opfsSah.message";

let db: OpfsDatabase | OpfsSAHPoolDatabase | Database;
let poolUtil: SAHPoolUtil;
const log = (...args) => console.log(...args);
const error = (...args) => console.error(...args);

self.onmessage = (messageEvent: MessageEvent) => {
  const sqliteMessage = messageEvent.data as SqliteMessageInterface;

  switch (sqliteMessage.type) {
    case SqliteMessageTypeEnum.CreateDatabase:
      sqlite3InitModule({
        print: log,
        printErr: error,
      }).then(async (sqlite3) => {

        const createDatabaseMessage = sqliteMessage as CreateDatabaseOpfsMessage;
        const uniqueId = createDatabaseMessage.uniqueId;
        try {
          switch (createDatabaseMessage.clientType) {
            case SqliteClientType.Opfs:
              db = new sqlite3.oo1.OpfsDb(createDatabaseMessage.filename, createDatabaseMessage.flags);
              break;
            case SqliteClientType.OpfsSah:
              poolUtil = await sqlite3.installOpfsSAHPoolVfs(createDatabaseMessage as CreateDatabaseOpfsSahMessage);
              db = new poolUtil.OpfsSAHPoolDb(createDatabaseMessage.filename);
              break;
            case SqliteClientType.Memory:
              db = new sqlite3.oo1.DB(createDatabaseMessage.filename, createDatabaseMessage.flags);
              break;
            default:
            throw new Error(`Unsupported SQLite Client Type: ${createDatabaseMessage.clientType}`)
          }
          self.postMessage(new CreateDatabaseResultMessage(uniqueId));
        } catch (err) {
          error(err.name, err.message);
          self.postMessage(new CreateDatabaseResultMessage(uniqueId, err));
        }
      });
      break;
    case SqliteMessageTypeEnum.ExecuteSql:
      // Execute the sql command.
      // Check if the database exists and if yes,
      const executeSqlMessage = sqliteMessage as ExecuteSqlMessage;

      try {
        const result = db.exec({
          sql: executeSqlMessage.sqlStatement,
          bind: executeSqlMessage.bindingParameters,
          returnValue: executeSqlMessage.returnValue as any, // to do i am no typescript ninja :-(
          rowMode: executeSqlMessage.rowMode,
        });
        self.postMessage(new ExecuteSqlResultMessage(executeSqlMessage.uniqueId, result));
      } catch (e) {
        self.postMessage(new ExecuteSqlResultMessage(executeSqlMessage.uniqueId, [], e));
      }

      break;
  }
}

