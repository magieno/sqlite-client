import {SqliteClient} from "../../src/sqlite-client";
import {SqliteClientTypeEnum} from "../../src/enums/sqlite-client-type.enum";
const filename = "/test.sqlite3";

const sqliteClient = new SqliteClient({
    type: SqliteClientTypeEnum.MemoryWorker,
    filename,
    flags: "c",
    sqliteWorkerPath: "dist/sqlite-client-worker.mjs"
})

const bootstrap = async () => {
    try {
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

        window["results"](results);
    } catch (e) {
        console.error(e);
    }
}

bootstrap();