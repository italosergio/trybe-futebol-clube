import Users from '../database/models/Users';

export default class User {
  static _user: Users | null;

  static async find(email) {
    this._user = await Users.findOne(
      { where: { email } },
    );
    return this._user;
  }
}
