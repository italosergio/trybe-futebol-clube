import * as express from 'express';
import { Teams, Team } from '../controller';

export default class TeamsRouter {
  public route: express.Router;

  constructor() {
    this.route = express.Router();
    this.config();
  }

  private config(): void {
    this.route.get('/', Teams.get);
    this.route.get('/:id', Team.get);
  }
}
