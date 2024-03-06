export enum RowModeEnum {
    /** Array of column values for every result row */
    Array = "array",
    /** Object mapping column names to values for every result row */
    Object = "object",
    /** Only for use with `callback` option, pass  {@link PreparedStatement} object for every row. */
    Statement = "stmt",
    /** Extract column with (zero-based) index from every result row */
    Number = "number",
    /** Extract column with name from every result row, must have format `$<column>`, with `column` having at least two characters.*/
    String = "string",
}