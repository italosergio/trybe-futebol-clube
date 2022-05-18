import IUser from '../interface/IUser';
import Users from '../database/models/Users';

export default class Find {
  static _user: IUser;

  static async User(email: string) {
    const User = await Users.findOne(
      { where: { email } },
    );

    this._user = {
      id: User?.getDataValue('id'),
      username: User?.getDataValue('username'),
      role: User?.getDataValue('role'),
      email: User?.getDataValue('email'),
      password: User?.getDataValue('password'),
    };
    return this._user;
  }
}
