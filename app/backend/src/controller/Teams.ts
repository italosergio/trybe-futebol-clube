import { NextFunction, Response, Request } from 'express';
import { ITeams } from '../interface';
import { Find } from '../service';

export default class Teams {
  private static _teams: ITeams[];

  static async get(_req: Request, res: Response, _next: NextFunction): Promise<Response> {
    this._teams = await Find.Teams();
    return res.status(200).json(this._teams);
  }
}
