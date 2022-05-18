import Users from '../database/models/Users';

export default class AllUsers {
  static _users: object;

  static async all() {
    this._users = await Users.findAll();
    return this._users;
  }
}
