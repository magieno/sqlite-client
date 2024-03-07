import {SqliteClientOptions} from "../types/sqlite-client.options";
import {SqliteClientTypeEnum} from "../enums/sqlite-client-type.enum";
import {CreateDatabaseMessage} from "../messages/create-database.message";
import {ReturnValueEnum} from "../enums/return-value.enum";
import {RowModeEnum} from "../enums/row-mode.enum";
import {ExecuteSqlMessage} from "../messages/execute-sql.message";
import {SqliteMessageTypeEnum} from "../enums/sqlite-message-type.enum";
import {ExecuteSqlResultMessage} from "../messages/execute-sql-result.message";
import {CreateDatabaseResultMessage} from "../messages/create-database-result.message";
import {SqliteMessageInterface} from "../interfaces/sqlite-message.interface";

/**
 * This class encapsulates all the communication with the Sqlite-Client-Worker.
 */
export class SqliteClientWorkerProxy {
    protected queuedPromises: { [hash in string]: { resolve: (...args) => void, reject: (...args) => void } } = {}

    public worker: Worker;

    constructor(private readonly options: SqliteClientOptions) {
    }

    public init(): Promise<void> {
        const promise = new Promise<any>((resolve, reject) => {
            this.queuedPromises[createDatabaseMessage.uniqueId] = {
                resolve,
                reject,
            };
        });

        if (this.options.type === SqliteClientTypeEnum.MemoryMainThread || !("sqliteWorkerPath" in this.options)) {
            throw new Error(`The Sqlite-Client-Worker does not support the [${SqliteClientTypeEnum.MemoryMainThread}] types. This type can be used directly in the main thread.`);
        }

        this.worker = new Worker(this.options.sqliteWorkerPath, {
            type: "module", // You need module for the '@sqlite.org/sqlite-wasm' library.
        })

        this.worker.onmessage = this.messageReceived.bind(this);

        const createDatabaseMessage = new CreateDatabaseMessage(this.options);

        this.worker.postMessage(createDatabaseMessage);

        return promise;
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

    public executeSql(sqlStatement: string, bindParameters: (string | number)[], returnValue: ReturnValueEnum, rowMode: RowModeEnum | number): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this.queuedPromises[executeSqlMessage.uniqueId] = {
                resolve,
                reject,
            };
        });

        const executeSqlMessage = new ExecuteSqlMessage(sqlStatement, bindParameters, returnValue, rowMode);

        this.worker.postMessage(executeSqlMessage);

        return promise;
    }
}