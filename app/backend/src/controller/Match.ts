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
      return res.status(401)
        .json({ message: 'It is not possible to create a match with two equal teams' });
    }

    const homeTeamExist = await Find.Team(homeTeam);
    const awayTeamExist = await Find.Team(awayTeam);

    if (!homeTeamExist || !awayTeamExist) {
      return res.status(404)
        .json({ message: 'There is no team with such id!' });
    }

    await Create.match(match);

    const createdMatch = await Find.Match(match);

    return res.status(201).json(createdMatch);
  }

  static async finish(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const { id } = req.params;

    await Update.matchFinish(id);

    return res.status(204).json({ message: 'Finished' });
  }

  static async score(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const {
      params: { id },
      body: { homeTeamGoals, awayTeamGoals },
    } = req;

    await Update.matchScore(id, homeTeamGoals, awayTeamGoals);

    return res.status(200).json({ message: 'Score updated' });
  }
}
