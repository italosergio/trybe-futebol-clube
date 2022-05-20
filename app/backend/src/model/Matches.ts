import { IMatch } from '../interface';
import MatchesModel from '../database/models/Matches';
import Teams from '../database/models/Teams';

export default class Matches {
  static _matches: IMatch[];

  static _match: IMatch;

  static async getAll() {
    this._matches = await MatchesModel.findAll({
      include: [
        { model: Teams, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: Teams, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });
    return this._matches;
  }

  static async getOne(match: IMatch) {
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
