import { IMatch } from '../interface';
import MatchesModel from '../database/models/Matches';
import Teams from '../database/models/Teams';

export default class Matches {
  static _matches: IMatch[];

  static async get() {
    this._matches = await MatchesModel.findAll({
      include: [
        { model: Teams, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: Teams, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });
    return this._matches;
  }
}
