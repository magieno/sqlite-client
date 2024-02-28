import { SqliteClientType } from "../enums/sqlite-message-type.enum";

export interface SqliteClientCommonOptions {
    filename: string,
  }
  
  export interface SqliteClientProxyOptions extends SqliteClientCommonOptions {
    sqliteWorkerPath: string,
  }
  
  export interface SqliteClientOpfsOptions extends SqliteClientProxyOptions {
    flags: string,
  }
  
  export interface SqliteClientOpfsSahOptions extends SqliteClientProxyOptions {
    /**
     * If truthy (default=false) contents and filename mapping are removed from
     * each SAH it is acquired during initalization of the VFS, leaving the
     * VFS's storage in a pristine state. Use this only for databases which need
     * not survive a page reload.
     */
    clearOnInit?: boolean;
  
    /**
     * (default=6) Specifies the default capacity of the VFS.
     *
     * This should not be set unduly high because the VFS has to open (and keep
     * open) a file for each entry in the pool. This setting only has an effect
     * when the pool is initially empty. It does not have any effect if a pool
     * already exists. Note that this number needs to be at least twice the
     * number of expected database files (to account for journal files) and may
     * need to be even higher than three times the number of databases plus one,
     * depending on the value of the `TEMP_STORE` pragma and how the databases
     * are used.
     */
    initialCapacity?: number;
  
    /**
     * (default="."+options.name) Specifies the OPFS directory name in which to
     * store metadata for the VFS.
     *
     * Only one instance of this VFS can use the same directory concurrently.
     * Using a different directory name for each application enables different
     * engines in the same HTTP origin to co-exist, but their data are invisible
     * to each other. Changing this name will effectively orphan any databases
     * stored under previous names. This option may contain multiple path
     * elements, e.g. "/foo/bar/baz", and they are created automatically. In
     * practice there should be no driving need to change this.
     *
     * **ACHTUNG:** all files in this directory are assumed to be managed by the
     * VFS. Do not place other files in this directory, as they may be deleted
     * or otherwise modified by the VFS.
     */
    directory?: string;
  
    /**
     * (default="opfs-sahpool") sets the name to register this VFS under.
     *
     * Normally this should not be changed, but it is possible to register this
     * VFS under multiple names so long as each has its own separate directory
     * to work from. The storage for each is invisible to all others. The name
     * must be a string compatible with `sqlite3_vfs_register()` and friends and
     * suitable for use in URI-style database file names.
     *
     * **ACHTUNG:** if a custom name is provided, a custom directory must also
     * be provided if any other instance is registered with the default
     * directory. No two instances may use the same directory. If no directory
     * is explicitly provided then a directory name is synthesized from the name
     * option.
     */
    name?: string;
  }
  
  export interface SqliteClientMemoryOptions extends SqliteClientProxyOptions {
    /** Eventhough the memory database can run in the main thread you still might 
     * want to run it in the worker thread. If so specify useWorker true.
     */
    useWorker?: boolean,
    flags: string, 
  }
  
  export interface SqlitClientFactoryOptions {
    clientType: SqliteClientType,
    options: SqliteClientOpfsOptions | SqliteClientOpfsSahOptions | SqliteClientMemoryOptions,
  }