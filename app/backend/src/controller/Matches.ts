import { NextFunction, Response, Request } from 'express';
import { Create, Find } from '../service';
import { IMatch } from '../interface';

export default class Matches {
  static _matches: IMatch[];

  static async getAll(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const inProgress = req.query.inProgress as string;

    this._matches = await Find.Matches();

    if (!inProgress) return res.status(200).json(this._matches);

    this._matches = this._matches
      .filter((match) => match.inProgress === JSON.parse(inProgress));

    return res.status(200).json(this._matches);
  }

  static async create(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const {
      homeTeam,
      awayTeam,
      homeTeamGoals,
      awayTeamGoals,
      inProgress,
    } = req.body;

    const match = {
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
