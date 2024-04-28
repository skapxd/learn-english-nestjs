declare namespace NodeJS {
  export interface ProcessEnv {
    API_SECRET: string;
    MONGO_DB: string;
    NODE_ENV: string;
    PORT: string;
  }
}
