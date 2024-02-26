export enum SqliteClientType {
  Opfs = "OPFS",
  OpfsSah = "OPFS_SAH",
  Memory = "MEMORY"
}

export enum SqliteMessageTypeEnum {
  CreateDatabase = "CREATE_DATABASE",
  CreateDatabaseResult = "CREATE_DATABASE_RESULT",
  ExecuteSql = "EXECUTE_SQL",
  ExecuteSqlResult = "EXECUTE_SQL_RESULT",
}