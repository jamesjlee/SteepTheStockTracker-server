declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    DATABASE_PORT: string;
    DATABASE_HOST: string;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;
    DATABASE_DBNAME: string;
    REDIS_URL: string;
    DATABASE_PORT: string;
    SESSION_SECRET: string;
    CORS_ORIGIN: string;
    SEND_EMAIL_USER: string;
    SEND_EMAIL_PASS: string;
    SEND_EMAIL_HOST: string;
    SEND_EMAIL_PORT: string;
    ALPHA_VANTAGE_KEY: string;
  }
}