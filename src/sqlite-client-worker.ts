import { SqliteClientType, SqliteMessageTypeEnum } from "./enums/sqlite-message-type.enum";
import { CreateDatabaseOpfsMessage } from "./messages/create-database.opfs.message";
import { SqliteMessageInterface } from "./interfaces/sqlite-message.interface";
import { CreateDatabaseResultMessage } from "./messages/create-database-result.message";
import { default as sqlite3InitModule } from "@sqlite.org/sqlite-wasm";
import { ExecuteSqlMessage } from "./messages/execute-sql.message";
import { ExecuteSqlResultMessage } from "./messages/execute-sql-result.message";

let db;
let poolUtil;
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
              poolUtil = await sqlite3.installOpfsSAHPoolVfs({
              });
              db = new poolUtil.OpfsSAHPoolDb(createDatabaseMessage.filename);
              break;
            default:
              db = new sqlite3.oo1.DB(createDatabaseMessage.filename, createDatabaseMessage.flags);
              break;
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
          returnValue: executeSqlMessage.returnValue,
          rowMode: executeSqlMessage.rowMode,

        });
        self.postMessage(new ExecuteSqlResultMessage(executeSqlMessage.uniqueId, result));
      } catch (e) {
        self.postMessage(new ExecuteSqlResultMessage(executeSqlMessage.uniqueId, [], e));
      }

      break;
  }
}

