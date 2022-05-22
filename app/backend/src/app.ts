import * as express from 'express';
import { Login, Team, Teams, Match, Matches, Classification } from './controller';
import { HttpError, Validate } from './middleware';

import 'express-async-errors';

class App {
  public app: express.Express;
  // ...

  constructor() {
    // ...
    this.app = express();

    this.app.use(express.json());

    this.config();
    // ...
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    const { app } = this;

    app.use(accessControl);
    app.post('/login', Validate.email, Validate.password, Login.sucess);
    app.get('/login/validate', Login.validate);
    app.get('/teams', Teams.get);
    app.get('/teams/:id', Team.get);
    app.get('/matches', Matches.get);
    app.post('/matches', Match.create);
    app.patch('/matches/:id', Match.score);
    app.patch('/matches/:id/finish', Match.finish);
    app.get('/leaderboard/home', Classification.get);
    app.use('/', HttpError.throw);

    // ...
  }

  // ...
  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`escutando na porta ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
