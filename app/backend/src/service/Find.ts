import { IUser, ITeams } from '../interface';
import { User, Teams } from '../model';

export default class Find {
  static _user: IUser;

  static _teams: ITeams[];

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
    const teams = await Teams.find();
    this._teams = teams;
    return this._teams;
  }
}
