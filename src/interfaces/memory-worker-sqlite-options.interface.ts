import {SqliteClientTypeEnum} from "../enums/sqlite-client-type.enum";

export interface MemoryWorkerSqliteOptionsInterface {
    type: SqliteClientTypeEnum.MemoryWorker;

    filename: string;

    flags: string;

    sqliteWorkerPath: string;
}