import * as express from 'express';
import { Login } from '../controller';
import { Validate } from '../middleware';

export default class LoginRouter {
  public route: express.Router;

  constructor() {
    this.route = express.Router();
    this.config();
  }

  private config():void {
    this.route.post('/', Validate.email, Validate.password, Login.sucess);
    this.route.get('/validate', Login.validate);
  }
}
