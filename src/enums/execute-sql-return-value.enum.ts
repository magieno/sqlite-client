export enum ExecuteSqlReturnValue {
    /** default, return database instance, use for fluent calls */
    this = "this",
    /** return values of `resultRows` array (set to empty array if not set by user) */
    resultRows = "resultRows",
    /** return values of `saveSql` option (set to empty array if not set by user) */
    saveSql = "saveSql",
  }
  