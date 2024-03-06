import {SqliteClientOptions} from "./types/sqlite-client.options";
import {SqliteAdapterInterface} from "./interfaces/sqlite-adapter.interface";
import {SqliteClientTypeEnum} from "./enums/sqlite-client-type.enum";
import {InMemorySqliteAdapter} from "./adapters/in-memory.sqlite-adapter";
import {ReturnValueEnum} from "./enums/return-value.enum";
import {RowModeEnum} from "./enums/row-mode.enum";

export class SqliteClient {
    public readonly adapter: SqliteAdapterInterface;

    constructor(private readonly options: SqliteClientOptions) {
        switch (this.options.type) {
            case SqliteClientTypeEnum.Memory:
                this.adapter = new InMemorySqliteAdapter(this.options);
                break;
            default:
                throw new Error(`Unknown sqlite client type: ${this.options.type}`);
        }
    }

    public async init() {
        return this.adapter.init();
    }

    public async executeSql(sqlStatement: string, bindParameters: (string | number)[], returnValue: ReturnValueEnum, rowMode: RowModeEnum | number): Promise<any> {
        if(this.adapter === undefined) {
            throw new Error("You need to call `init` before calling `executeSql`.");
        }

        return this.adapter.executeSql(sqlStatement, bindParameters, returnValue, rowMode);
    }
}
