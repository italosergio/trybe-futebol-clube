import { IMatch } from '../interface';
import MatchesModel from '../database/models/Matches';

export default class Match {
  static _match: IMatch;

  static async get(match: IMatch) {
    this._match = await MatchesModel.findOne(
      {
        where: { ...match },
        order: [['id', 'DESC']],
      },
    ) as IMatch;
    return this._match;
  }

  static async insert(values: IMatch) {
    return MatchesModel.create(values);
  }
}