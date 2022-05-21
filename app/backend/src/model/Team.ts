import { ITeam } from '../interface';
import TeamsModel from '../database/models/Teams';

export default class Team {
  static _team: ITeam | null;

  static async get(id: string) {
    this._team = await TeamsModel.findOne({ where: { id } });
    return this._team;
  }
}
