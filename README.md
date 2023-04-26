# Web SQLite

Web SQLite is a wrapper for SQLite Wasm that uses the Origin Private File System (OPFS) to persist the SQLite database file.

It only supports OPFS as a persistence mechanism.

## Installation using NPM

This library has two important files: `web-sqlite.js` and `web-sqlite-worker.js`. 
Due to some browser restrictions, SQLite WASM can only persist over OPFS when executed in a Worker. 
Behind the scenes, WebSqlite communicates with a worker to run the SQL statements and return you the results
on the main thread.  

1- Install the NPM package

```
npm install @magieno/web-sqlite
```

2- Import the `web-sqlite` library in your code and use it as such:

```
import {WebSqlite} from "@magieno/web-sqlite";

const webSqliteWorkerPath = "assets/js/web-sqlite-worker.js"; // Must correspond to the path in your final deployed build.
const filename = "/test.sqlite3"; // This is the name of your database. It corresponds to the path in the OPFS.

const webSqlite = new WebSqlite(filename, webSqliteWorkerPath)
await webSqlite.init();

await webSqlite.executeSql("CREATE TABLE IF NOT EXISTS test(a,b)");
await webSqlite.executeSql("INSERT INTO test VALUES(?, ?)", [6,7]);
const results = await webSqlite.executeSql("SELECT * FROM test");
```

3- Copy the `node_modules/@magieno/web-sqlite/dist/bundle/web-sqlite-worker.js` to your final bundle
This is dependent on the framework you are using but the idea is that this .js file should be copied and available in your build.

4- Copy the files `third_party/sqlite/3.41.2/` file to your final bundle, in the same folder of your final bundle next to `web-sqlite-worker.js`.

5- **Warning** Your server must set the following Http headers when serving your files

`Cross-Origin-Opener-Policy: same-origin`

`Cross-Origin-Embedder-Policy: require-corp`

### Demos
We have created a repository that contains demos that you can look at: 

https://github.com/magieno/web-sqlite-demo
