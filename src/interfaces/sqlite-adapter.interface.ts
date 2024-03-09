import {RowModeEnum} from "../enums/row-mode.enum";
import {ReturnValueEnum} from "../enums/return-value.enum";

export interface SqliteAdapterInterface {
    init(): Promise<any>;
    executeSql(sqlStatement: string, bindParameters: (string | number)[], returnValue: ReturnValueEnum, rowMode: RowModeEnum | number): Promise<any>;
}