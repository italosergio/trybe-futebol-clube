import * as bcrypt from 'bcryptjs';
import IUser from '../interface/IUser';
import Find from './Find';

export default class Helper {
  private static _user: IUser;

  static async bcrypt(email: string, password: string): Promise<IUser | null> {
    this._user = await Find.User(email) as IUser;

    const isCorrectPass = await bcrypt.compare(password, this._user.password);

    return isCorrectPass ? this._user : null;
  }
}
