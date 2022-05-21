import { IUser, ITeam, IMatch } from '../interface';
import { User, Team, Teams, Match, Matches } from '../model';

export default class Find {
  static _user: IUser;

  static _teams: ITeam[];

  static _team: ITeam | null;

  static _matches: IMatch[];

  static _match: IMatch;

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
    this._team = await Team.get(id);
    return this._team;
  }

  static async Matches() {
    this._matches = await Matches.get();
    return this._matches;
  }

  static async Match(match: IMatch) {
    this._match = await Match.get(match);
    return this._match;
  }
}
