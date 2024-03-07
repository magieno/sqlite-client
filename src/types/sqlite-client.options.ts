import {MemoryMainThreadSqliteOptionsInterface} from "../interfaces/memory-main-thread-sqlite-options.interface";
import {OpfsWorkerSqliteOptionsInterface} from "../interfaces/opfs-worker-sqlite-options.interface";
import {MemoryWorkerSqliteOptionsInterface} from "../interfaces/memory-worker-sqlite-options.interface";
import {OpfsSahWorkerSqliteOptionsInterface} from "../interfaces/opfs-sah-worker-sqlite-options.interface";

export type SqliteClientOptions =
    MemoryMainThreadSqliteOptionsInterface |
    MemoryWorkerSqliteOptionsInterface |
    OpfsSahWorkerSqliteOptionsInterface |
    OpfsWorkerSqliteOptionsInterface  ;