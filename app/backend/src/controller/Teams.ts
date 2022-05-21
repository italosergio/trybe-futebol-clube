import { NextFunction, Response, Request } from 'express';
import { ITeam } from '../interface';
import { Find } from '../service';

export default class Teams {
  private static _teams: ITeam[];

  static async get(_req: Request, res: Response, _next: NextFunction): Promise<Response> {
    this._teams = await Find.Teams();
    return res.status(200).json(this._teams);
  }
}
