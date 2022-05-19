import { Response, Request, NextFunction } from 'express';
import { Error } from 'sequelize/types';

export default class HttpError {
  static throw(err: Error, req: Request, res: Response, _next: NextFunction): Response {
    return res.status(200).json({ message: 'Something wrong!' });
  }
}
