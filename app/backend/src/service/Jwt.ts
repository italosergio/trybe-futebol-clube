import * as fs from 'fs/promises';
import * as jwt from 'jsonwebtoken';
import IUser from '../interface/IUser';

export default class Token {
  private static secret: string;

  private static token: string;

  private static decoded: string | jwt.JwtPayload;

  static async generator(user: IUser) {
    this.secret = await fs.readFile('jwt.evaluation.key', 'utf-8');
    this.token = jwt.sign({ user }, this.secret, {
      expiresIn: '1d',
      algorithm: 'HS256',
    });
    return this.token;
  }

  static async decode(userToken: string) {
    this.secret = await fs.readFile('jwt.evaluation.key', 'utf-8');
    const { user } = await jwt
      .verify(userToken, this.secret) as { user: IUser, iat: number, exp: number };
    this.decoded = user;
    return this.decoded;
  }
}
