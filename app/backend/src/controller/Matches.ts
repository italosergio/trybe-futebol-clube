import { NextFunction, Response, Request } from 'express';
import { Find } from '../service';
import { IMatch } from '../interface';

export default class Matches {
  static _matches: IMatch[];

  static async all(_req: Request, res: Response, _next: NextFunction): Promise<Response> {
    this._matches = await Find.Maches();
    return res.status(200).json(this._matches);
  }
}
