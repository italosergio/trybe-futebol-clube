import IUser from '../interface/IUser';
import Users from '../database/models/Users';

export default class Find {
  static user: IUser | null;

  static async User(email: string, password: string) {
    this.user = await Users.findOne(
      { where: { email, password }, attributes: { exclude: ['password'] } },
    );
    return this.user;
  }
}
