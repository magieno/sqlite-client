import {SqliteClient} from "../../src/sqlite-client";
import {SqliteClientTypeEnum} from "../../src/enums/sqlite-client-type.enum";
const filename = "/test.sqlite3";

const sqliteClient = new SqliteClient({
    type: SqliteClientTypeEnum.MemoryMainThread,
    filename,
    flags: "c",
})

const bootstrap = async () => {
    await sqliteClient.init();

    await sqliteClient.executeSql("CREATE TABLE IF NOT EXISTS users(first_name,last_name,email)");

    for (const value of [
        ["John", "Smith", "john.smith@gmail.com"],
        ["Johnny", "Smithers", "johnny.smithers@gmail.com"],
        ["Jean", "Tremblay", "jean.tremblay@gmail.com"],
    ]) {
        await sqliteClient.executeSql("INSERT INTO users VALUES(?, ?, ?)", value);
    }

    const results = await sqliteClient.executeSql("SELECT * FROM users");

    window["results"] = results;
}

bootstrap();