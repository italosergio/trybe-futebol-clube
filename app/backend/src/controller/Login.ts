import { NextFunction, Request, Response } from 'express';
import { Token } from '../service';
import Helper from '../service/Helper';
import IUser from '../interface/IUser';

export default class Login {
  private static _user: IUser;

  static async sucess(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const { email, password } = req.body;
    this._user = await Helper.bcrypt(email, password) as IUser;
    const token = await Token.generator(this._user);

    const user = {
      id: this._user.id,
      username: this._user.username,
      role: this._user.role,
      email,
    };

    return res.status(200).json({ user, token });
  }

  static async validate(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const token = req.headers.authorization as string;
    const { role } = await Token.decode(token);

    return res.status(200).send(role);
  }
}
