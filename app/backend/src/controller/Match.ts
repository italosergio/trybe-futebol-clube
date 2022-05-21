import { NextFunction, Response, Request } from 'express';
import { Create, Find, Update } from '../service';
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

    if (homeTeam === awayTeam) return res.status(400).json({ message: 'times iguais' });

    await Create.match(match);

    const createdMatch = await Find.Match(match);

    return res.status(201).json(createdMatch);
  }

  static async finish(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const { id } = req.params;
    await Update.matchFinish(id);
    return res.status(200).json({ message: 'Finished' });
  }
}
