export enum ReturnValueEnum {
    /** default, return database instance, use for fluent calls */
    This = "this",
    /** return values of `resultRows` array (set to empty array if not set by user) */
    ResultRows = "resultRows",
    /** return values of `saveSql` option (set to empty array if not set by user) */
    SaveSql = "saveSql",
}