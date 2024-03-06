import {SqliteClientTypeEnum} from "../enums/sqlite-client-type.enum";

export interface InMemorySqliteAdapterOptionsInterface {
    type: SqliteClientTypeEnum.Memory;

    filename: string;

    flags: string;
}