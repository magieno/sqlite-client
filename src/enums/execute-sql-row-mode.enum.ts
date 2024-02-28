export enum ExecuteSqlRowMode {
    /** Array of column values for every result row */
    array = "array",
    /** Object mapping column names to values for every result row */
    object = "object",
    /** Only for use with `callback` option, pass  {@link PreparedStatement} object for every row. */
    stmt = "stmt",
    /** Extract column with (zero-based) index from every result row */
    number = "number",
    /** Extract column with name from every result row, must have format `$<column>`, with `column` having at least two characters.*/
    string = "string",
  
  }