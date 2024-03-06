# SQLite Client

SQLite Client is a wrapper for [SQLite](https://github.com/sqlite/sqlite-wasm) that uses the Origin Private File System (OPFS) to persist the SQLite database file.

It only supports OPFS as a persistence mechanism.

## Installation using NPM

This library has two important files: `sqlite-client.js` and `sqlite-client-worker.js`. 
Due to some browser restrictions, SQLite WASM can only persist over OPFS when executed in a Worker. 
Behind the scenes, Sqlite communicates with a worker to run the SQL statements and return you the results
on the main thread.  

1- Install the NPM package

```
npm install @magieno/sqlite-client
```

2- Import the `sqlite-client` library in your code and use it as such:

```
import {SqliteClient} from "@magieno/sqlite-client";

const sqliteWorkerPath = "assets/js/sqlite-client-worker.js"; // Must correspond to the path in your final deployed build.
const filename = "/test.sqlite3"; // This is the name of your database. It corresponds to the path in the OPFS.

const sqliteClient = new SqliteClient({
    filename,
    sqliteWorkerPath,
})
await sqliteClient.init();

await sqliteClient.executeSql("CREATE TABLE IF NOT EXISTS test(a,b)");
await sqliteClient.executeSql("INSERT INTO test VALUES(?, ?)", [6,7]);
const results = await sqliteClient.executeSql("SELECT * FROM test");
```

3- Copy the `node_modules/@magieno/sqlite-client/dist/bundle/sqlite-client-worker.js` to your final bundle
This is dependent on the framework you are using but the idea is that this .js file should be copied and available in your build.

4- Copy the files `node_modules/@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/*` file to your final bundle next to `sqlite-client-worker.js`.

5- **Warning** Your server must set the following Http headers when serving your files

`Cross-Origin-Opener-Policy: same-origin`

`Cross-Origin-Embedder-Policy: require-corp`

### Demos
We have created a repository that contains demos that you can look at: 

https://github.com/magieno/sqlite-client-demo
