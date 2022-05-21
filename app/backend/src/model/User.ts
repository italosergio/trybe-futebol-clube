import { IUser } from '../interface';
import Users from '../database/models/Users';

export default class User {
  static _user: IUser | null;

  static async find(email: string) {
    this._user = await Users.findOne({ where: { email } });
    return this._user;
  }
}
