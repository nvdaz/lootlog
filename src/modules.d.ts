/* eslint-disable @typescript-eslint/interface-name-prefix */
declare namespace NodeJS {
  export interface ProcessEnv {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    MONGODB_URI: string;
    JWT_SECRET: string;
    DSN: string;
  }
}
