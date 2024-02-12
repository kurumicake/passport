import { Strategy as GitHubStrategy } from "passport-github2";
import { PassportStrategy } from "../../interfaces/index";
import { VerifyCallback } from "passport-oauth2";
import { Request } from "express";
import { userModel } from "../../models/userModel";

const githubStrategy = new GitHubStrategy(
  {
    clientID: "803179d447aa424f179a",
    clientSecret: "5fa720e826afc60713be5cd77b6b04ee0ccf798b",
    callbackURL: "http://localhost:8000/auth/github/callback",
    passReqToCallback: true,
  },
  async (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ) => {
    try {
      const { user, created } = await userModel.findOrCreate(
        profile.id,
        profile
      );
      done(null, user);
    } catch (err) {
      done(err as Error);
    }
  }
);

const passportGithubStrategy: PassportStrategy = {
  name: 'github',
  strategy: githubStrategy,
};

export default passportGithubStrategy;
