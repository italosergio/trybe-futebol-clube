import { ITeam } from '../interface';
import TeamsModel from '../database/models/Teams';

export default class Teams {
  static _teams: ITeam[];

  static async get() {
    this._teams = await TeamsModel.findAll();
    return this._teams;
  }
}
