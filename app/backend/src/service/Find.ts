import { IUser, ITeam, IMatch } from '../interface';
import { User, Team, Teams, Match, Matches } from '../model';

export default class Find {
  static _user: IUser | null;

  static _teams: ITeam[];

  static _team: ITeam | null;

  static _matches: IMatch[];

  static _match: IMatch;

  static async User(email: string) {
    this._user = await User.find(email);
    return this._user;
  }

  static async Teams() {
    this._teams = await Teams.get();
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
