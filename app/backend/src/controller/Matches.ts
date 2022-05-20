import { NextFunction, Response, Request } from 'express';
import { Find } from '../service';
import { IMatch } from '../interface';

export default class Matches {
  static _matches: IMatch[];

  static async get(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const inProgress = req.query.inProgress as string;

    this._matches = await Find.Matches();

    if (!inProgress) return res.status(200).json(this._matches);

    this._matches = this._matches
      .filter((match) => match.inProgress === JSON.parse(inProgress));

    return res.status(200).json(this._matches);
  }
}
