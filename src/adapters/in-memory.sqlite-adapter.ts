import { Database, Sqlite3Static, default as sqlite3InitModule } from "@sqlite.org/sqlite-wasm";
import {SqliteAdapterInterface} from "../interfaces/sqlite-adapter.interface";
import {ReturnValueEnum} from "../enums/return-value.enum";
import {RowModeEnum} from "../enums/row-mode.enum";
import {InMemorySqliteAdapterOptionsInterface} from "../interfaces/in-memory-sqlite-adapter-options.interface";

export class InMemorySqliteAdapter implements SqliteAdapterInterface {
    protected filename: string;
    protected flags: string;

    protected sqlite3: Sqlite3Static | void;
    protected db: Database;

    constructor(private readonly options: InMemorySqliteAdapterOptionsInterface) {
    }

    public getDB(): Database | undefined {
        return this.db;
    }

    public async init(): Promise<any> {
        this.sqlite3 = await sqlite3InitModule({
            print: console.log,
            printErr: console.error,
        });

        this.db = new this.sqlite3.oo1.DB(this.filename, this.flags);
    }

    public async executeSql(sqlStatement: string,
                      bindParameters: (string | number)[] = [],
                      returnValue: ReturnValueEnum = ReturnValueEnum.ResultRows,
                      rowMode: RowModeEnum | number = RowModeEnum.Array): Promise<any> {

        return this.db.exec({
            sql: sqlStatement,
            bind: bindParameters,
            returnValue: returnValue as any, // todo: investigate why Typescript expect that this be set to 'saveSql'.
            rowMode: rowMode,
        });
    }
}