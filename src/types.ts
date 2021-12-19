import { Request, Response } from 'express';
import { Session } from 'express-session';
import { Redis } from 'ioredis';
import { createUserLoader } from './entities/utils/createUserLoader';

declare module 'express-session' {
  export interface Session {
    userId: number | undefined;
  }
}

export type MyContext = {
  req: Request & { session: Session };
  res: Response;
  redis: Redis;
  userLoader: ReturnType<typeof createUserLoader>;
};
