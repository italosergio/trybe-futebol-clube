import { compare } from 'bcryptjs';
import IUser from '../interface/IUser';
import Find from './FindUser';

export default class Helper {
  private static _user: IUser;

  static async bcrypt(email: string, password: string): Promise<IUser | null> {
    this._user = await Find.User(email);

    const isCorrectPass = await compare(password, this._user.password);

    console.log(isCorrectPass);

    return isCorrectPass ? this._user : null;
  }
}
