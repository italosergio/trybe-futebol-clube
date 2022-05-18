import * as express from 'express';
import Login from './controller/Login';
import HttpError from './middleware/index';

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
    app.use('/', HttpError.throw);
    app.post('/login', Login.sucess);
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
