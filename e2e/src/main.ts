import {SqliteClient} from "../../src/sqlite-client";
import {SqliteClientTypeEnum} from "../../src/enums/sqlite-client-type.enum";

const memoryMainThreadFilename = "/memory.main-thread.sqlite3";
const memoryWorkerFilename = "/memory.worker.sqlite3";
const opfsWorkerFilename = "/opfs.worker.sqlite3";
const opfsSahWorkerFilename = "/opfs-sah.worker.sqlite3";

window["memoryMainThreadSqliteClient"] = new SqliteClient({
    type: SqliteClientTypeEnum.MemoryMainThread,
    filename: memoryMainThreadFilename,
    flags: "c",
})

window["memoryWorkerSqliteClient"] = new SqliteClient({
    type: SqliteClientTypeEnum.MemoryWorker,
    filename: memoryWorkerFilename,
    flags: "c",
    sqliteWorkerPath: "dist/sqlite-client-worker.mjs"
})

window["opfsWorkerSqliteClient"] = new SqliteClient({
    type: SqliteClientTypeEnum.OpfsWorker,
    filename: opfsWorkerFilename,
    flags: "c",
    sqliteWorkerPath: "dist/sqlite-client-worker.mjs"
})

window["opfsSahWorkerSqliteClient"] = new SqliteClient({
    type: SqliteClientTypeEnum.OpfsSahWorker,
    filename: opfsSahWorkerFilename,
    sqliteWorkerPath: "dist/sqlite-client-worker.mjs",
})

window["clearTestData"] = async (sqliteClient: SqliteClient, tableBodyId: string) => {
    try {
        await sqliteClient.executeSql("DROP TABLE IF EXISTS users");

        document.getElementById(tableBodyId)!.innerHTML = "";
    } catch (e) {
        console.error(e)
    }
}

window["loadTestData"] = async (sqliteClient: SqliteClient, tableBodyId: string) => {
    try {
        await sqliteClient.executeSql("CREATE TABLE IF NOT EXISTS users(first_name,last_name,email)");

        for (const value of [
            ["John", "Smith", "john.smith@gmail.com"],
            ["Johnny", "Smithers", "johnny.smithers@gmail.com"],
            ["Jean", "Tremblay", "jean.tremblay@gmail.com"],
        ]) {
            await sqliteClient.executeSql("INSERT INTO users VALUES(?, ?, ?)", value);
        }

        const results = await sqliteClient.executeSql("SELECT * FROM users");

        let html = "";
        results.forEach(columns => {
            html += `<tr><td>${columns[0]}</td><td>${columns[1]}</td><td>${columns[2]}</td></tr>`;
        })

        document.getElementById(tableBodyId)!.innerHTML = html;

    } catch (e) {
        console.error(e);
    }
}