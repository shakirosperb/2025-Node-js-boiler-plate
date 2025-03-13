import ConnectionModule from './ConnectionModule';

const DBURL_1 = process.env.DBURL_1 || ""
const MainConnection = new ConnectionModule(DBURL_1)
export interface MONGO_DB_NAMES {
    MAIN_DB: any
}

export {
    MainConnection,
};