import * as express from 'express';
import { Classification } from '../controller';

export default class LeaderboardRouter {
  public route: express.Router;

  constructor() {
    this.route = express.Router();
    this.config();
  }

  private config() {
    this.route.get('/home', Classification.home);
    this.route.get('/away', Classification.away);
    this.route.get('/', Classification.general);
  }
}
