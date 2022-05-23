import * as express from 'express';
import { Login, Team, Teams, Match, Matches, Classification } from './controller';
import { HttpError, Validate } from './middleware';

import 'express-async-errors';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();

    this.app.use(express.json());

    this.config();

    this.routes();
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(accessControl);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`escutando na porta ${PORT}`));
  }

  private routes(): void {
    this.app.post('/login', Validate.email, Validate.password, Login.sucess);
    this.app.get('/login/validate', Login.validate);
    this.app.get('/teams', Teams.get);
    this.app.get('/teams/:id', Team.get);
    this.app.get('/matches', Matches.get);
    this.app.post('/matches', Match.create);
    this.app.patch('/matches/:id', Match.score);
    this.app.patch('/matches/:id/finish', Match.finish);
    this.app.get('/leaderboard/home', Classification.home);
    this.app.use('/', HttpError.throw);
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
