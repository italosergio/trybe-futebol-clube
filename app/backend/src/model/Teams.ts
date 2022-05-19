import { ITeams } from '../interface';
import TeamsModel from '../database/models/Teams';

export default class Teams {
  static _teams: ITeams[];

  static async find() {
    this._teams = await TeamsModel.findAll();
    return this._teams;
  }
}
