import { Database, Sqlite3Static, default as sqlite3InitModule } from "@sqlite.org/sqlite-wasm";
import {SqliteAdapterInterface} from "../interfaces/sqlite-adapter.interface";
import {ReturnValueEnum} from "../enums/return-value.enum";
import {RowModeEnum} from "../enums/row-mode.enum";
import {MemoryMainThreadSqliteOptionsInterface} from "../interfaces/memory-main-thread-sqlite-options.interface";
import {SqliteClientWorkerProxy} from "../proxies/sqlite-client-worker.proxy";
import {OpfsWorkerSqliteOptionsInterface} from "../interfaces/opfs-worker-sqlite-options.interface";
import {MemoryWorkerSqliteOptionsInterface} from "../interfaces/memory-worker-sqlite-options.interface";
import {OpfsSahWorkerSqliteOptionsInterface} from "../interfaces/opfs-sah-worker-sqlite-options.interface";

export class InWorkerSqliteAdapter implements SqliteAdapterInterface {
    public proxy: SqliteClientWorkerProxy;

    constructor(private readonly options:
                    MemoryWorkerSqliteOptionsInterface |
                    OpfsWorkerSqliteOptionsInterface |
                    OpfsSahWorkerSqliteOptionsInterface
                    ) {
        this.proxy = new SqliteClientWorkerProxy(options);
    }

    public async init(): Promise<any> {
        return this.proxy.init();
    }

    public async executeSql(sqlStatement: string,
                      bindParameters: (string | number)[] = [],
                      returnValue: ReturnValueEnum = ReturnValueEnum.ResultRows,
                      rowMode: RowModeEnum | number = RowModeEnum.Array): Promise<any> {
        return this.proxy.executeSql(sqlStatement, bindParameters, returnValue, rowMode);
    }
}