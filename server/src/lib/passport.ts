import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { JwtPayload } from "jsonwebtoken";

import prisma from "./prismaClient";
import { CustomError } from "../utils/helper";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
};

passport.use(
  new Strategy(opts, async (jwtPayload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: jwtPayload.userId },
      });

      if (user) return done(null, user);
      done(null, false);
    } catch (error) {
      done(error, false);
    }
  })
);

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: JwtPayload | false, info: any) => {
      if (err) return next(err);
      if (!user) {
        const error = new Error("Unauthorized") as CustomError;
        error.status = 401;
        next(err);
      }

      req.user = user;
      next();
    }
  )(req, res, next);
};

export const isAuthenticated = passport.authenticate("jwt", { session: false });

export default passport;
