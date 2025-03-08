// Generated by Xata Codegen 0.30.1. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
    BaseClientOptions,
    SchemaInference,
    XataRecord,
} from "@xata.io/client";

const tables = [] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type DatabaseSchema = {};

const DatabaseClient = buildClient();

const defaultOptions = {
    databaseURL: process.env.DB_URL,
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
    constructor(options?: BaseClientOptions) {
        super({ ...defaultOptions, ...options }, tables);
    }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
    if (instance) return instance;

    instance = new XataClient({
        apiKey: process.env.XATA_API_KEY,
        branch: process.env.XATA_BRANCH,
    });
    return instance;
};
