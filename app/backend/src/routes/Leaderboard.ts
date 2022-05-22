import * as express from 'express';
import { Classification } from '../controller';

export default class LeaderboardRouter {
  public route: express.Router;

  constructor() {
    this.route = express.Router();
  }

  private config() {
    this.route.get('/home', Classification.home);
  }
}
