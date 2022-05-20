import { ITeam } from '../interface';
import TeamsModel from '../database/models/Teams';

export default class Team {
  static _team: ITeam;

  static async find(id) {
    this._team = await TeamsModel.findOne({ where: { id } }) as ITeam;
    return this._team;
  }
}
