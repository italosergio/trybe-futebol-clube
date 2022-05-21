import { NextFunction, Response, Request } from 'express';
import { Create, Find } from '../service';
import { IMatch } from '../interface';

export default class Match {
  static async create(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const {
      homeTeam,
      awayTeam,
      homeTeamGoals,
      awayTeamGoals,
      inProgress,
    } = req.body;

    const match: IMatch = {
      homeTeam,
      awayTeam,
      homeTeamGoals,
      awayTeamGoals,
      inProgress,
    };

    await Create.match(match);

    const createdMatch = await Find.Match(match);

    return res.status(201).json(createdMatch);
  }
}