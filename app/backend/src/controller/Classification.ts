import { NextFunction, Request, Response } from 'express';
import { IMatch, ITeam, ITeamResults } from '../interface';
import { Matches, Teams } from '../model';
import { Leaderboard } from '../service';

export default class Classification {
  static leaderbord: ITeamResults[];

  static async home(_req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const teams: ITeam[] = await Teams.get();
    const matches: IMatch[] = await Matches.get();

    const get = new Leaderboard(teams, matches, 'home');
    return res.status(200).json(get.leaderboard);
  }

  static async away(_req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const teams: ITeam[] = await Teams.get();
    const matches: IMatch[] = await Matches.get();

    const get = new Leaderboard(teams, matches, 'away');
    return res.status(200).json(get.leaderboard);
  }

  static async general(_req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const teams: ITeam[] = await Teams.get();
    const matches: IMatch[] = await Matches.get();

    const get = new Leaderboard(teams, matches);
    return res.status(200).json(get.leaderboard);
  }
}
