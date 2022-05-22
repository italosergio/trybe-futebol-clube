import * as express from 'express';
import { Matches, Match } from '../controller';

export default class MatchesRouter {
  public route: express.Router;

  constructor() {
    this.route = express.Router();
    this.config();
  }

  private config() {
    this.route.get('/', Matches.get);
    this.route.post('/', Match.create);
    this.route.patch('/:id', Match.score);
    this.route.patch('/:id/finish', Match.finish);
  }
}
