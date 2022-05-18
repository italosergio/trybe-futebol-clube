import { NextFunction, Request, Response } from 'express';
import { Token } from '../service';
import Helper from '../service/Helper';
import IUser from '../interface/IUser';

export default class Login {
  private static _user: IUser;

  static async sucess(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const { email, password } = req.body;
    const isCorrectUser = await Helper.bcrypt(email, password);
    // console.log(isCorrectUser);

    if (isCorrectUser) this._user = isCorrectUser;
    const token = await Token.generator(this._user);

    const user = {
      id: this._user.id,
      username: this._user.username,
      role: this._user.role,
      email,
    };

    return res.status(200).json({ user, token });
  }
}
