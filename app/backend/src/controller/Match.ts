import { NextFunction, Response, Request } from 'express';
import { Create, Find, Update } from '../service';
import { IMatch } from '../interface';

export default class Match {
  static async create(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const {
      homeTeam,
      awayTeam,
    } = req.body;

    const match: IMatch = { ...req.body };

    if (homeTeam === awayTeam) {
      res
        .status(401)
        .json({ message: 'It is not possible to create a match with two equal teams' });
    }

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
