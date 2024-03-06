import {InMemorySqliteAdapterOptionsInterface} from "../interfaces/in-memory-sqlite-adapter-options.interface";

export type SqliteClientOptions = InMemorySqliteAdapterOptionsInterface; // Here, add a union of all the other interfaces and only differentiate based on the `type` property. Typescript will automatically provide you with the options for the specific type of client you are using.