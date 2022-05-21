import { NextFunction, Response, Request } from 'express';
import { Find } from '../service';
import { ITeam } from '../interface';

export default class Team {
  static async get(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const { params: { id } } = req;
    const team: ITeam | null = await Find.Team(id);
    return res.status(200).json(team);
  }
}
