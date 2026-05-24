import { NextFunction, Request, Response } from "express";

export const enableTracking =
  () => (req: Request, _res: Response, next: NextFunction) => {
    req.shouldTrack = true;
    next();
  };
