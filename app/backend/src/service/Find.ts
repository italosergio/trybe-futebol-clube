import { IUser, ITeams, ITeam, IMatch } from '../interface';
import { User, Team, Teams, Matches } from '../model';

export default class Find {
  static _user: IUser;

  static _teams: ITeams[];

  static _team: ITeam;

  static _matches: IMatch[];

  static async User(email: string) {
    const user = await User.find(email);

    this._user = {
      id: user?.getDataValue('id'),
      username: user?.getDataValue('username'),
      role: user?.getDataValue('role'),
      email: user?.getDataValue('email'),
      password: user?.getDataValue('password'),
    };

    return this._user;
  }

  static async Teams() {
    this._teams = await Teams.find();
    return this._teams;
  }

  static async Team(id: string) {
    this._team = await Team.find(id);
    return this._team;
  }

  static async Maches() {
    this._matches = await Matches.getAll();
    return this._matches;
  }
}
