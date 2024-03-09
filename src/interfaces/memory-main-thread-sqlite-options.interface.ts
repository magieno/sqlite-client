import {SqliteClientTypeEnum} from "../enums/sqlite-client-type.enum";

export interface MemoryMainThreadSqliteOptionsInterface {
    type: SqliteClientTypeEnum.MemoryMainThread;

    filename: string;

    flags: string;
}