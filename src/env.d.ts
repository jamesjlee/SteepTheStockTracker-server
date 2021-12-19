declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: string;
    SESSION_SECRET: string;
    CORS_ORIGIN: string;
    SEND_EMAIL_USER: string;
    SEND_EMAIL_PASS: string;
    SEND_EMAIL_HOST: string;
    SEND_EMAIL_PORT: string;
  }
}