import { Request, Response, NextFunction } from 'express';
import { Helper } from '../service';

export default class Validate {
  static email(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    if (!email) return res.status(401).json({ message: 'All fields must be filled' });
    const regex = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-z]+)$/;
    const isValidEmail = regex.test(String(email).toLowerCase());
    if (isValidEmail) return next();
    return res.status(401).json({ message: 'Incorrect email or password' });
  }

  static async password(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    if (!password) return res.status(401).json({ message: 'All fields must be filled' });
    const isCorrectUser = await Helper.bcrypt(email, password);
    if (isCorrectUser) return next();
    return res.status(401).json({ message: 'Incorrect email or password' });
  }
}
