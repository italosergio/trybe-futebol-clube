import { Request, Response, NextFunction } from 'express';
import { Helper } from '../service';

export default class Validate {
  static email(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    const regex = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-z]+)$/;
    const isValidEmail = regex.test(String(email).toLowerCase());
    if (isValidEmail) return next();
    return res.status(401).json({ message: 'Incorrect email or password' });
  }

  static async password(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const isCorrectUser = await Helper.bcrypt(email, password);
    if (isCorrectUser) return next();
    return res.status(401).json({ message: 'Incorrect email or password' });
  }
}
