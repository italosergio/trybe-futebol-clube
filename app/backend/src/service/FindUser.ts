import IUser from '../interface/IUser';
import User from '../model';

export default class Find {
  static _user: IUser;

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
}
