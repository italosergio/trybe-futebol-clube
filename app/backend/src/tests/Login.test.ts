import 'mocha';
import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import Users from '../database/models/Users';
import IUser from '../interface/IUser';

import { app } from '../app';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

const UserMock = {
  getDataValue: (param: string): string | number => {
    const user: IUser = {
      id: 1,
      username: 'batman',
      email: 'batman@justiceleague.org',
      role: 'admin',
      password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW' // secret_admin
    }
    
    return user[param];
  }
}

let chaiHttpResponse: Response;

describe('1 - POST /login - Correct email and password', () => {
  before(async () => {
    sinon
      .stub(Users, "findOne")
      .resolves({...UserMock} as unknown as Users);

    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'batman@justiceleague.org',
        password: 'secret_admin'
      });
  });

  after(async ()=>{
    (Users.findOne as sinon.SinonStub).restore();
  })

  it('Status 200', async () => {
    expect(chaiHttpResponse.status).exist;
    expect(chaiHttpResponse.status).to.be.equal(200);
  });

  it('Response body id', async () => {
    expect(chaiHttpResponse.body.user.id).exist;
    expect(chaiHttpResponse.body.user.id).to.be.equal(1);
  });

  it('Response body username', async () => {
    expect(chaiHttpResponse.body.user.username).exist;
    expect(chaiHttpResponse.body.user.username).to.be.equal('batman');
  });

  it('Response body role', async () => {
    expect(chaiHttpResponse.body.user.role).exist;
    expect(chaiHttpResponse.body.user.role).to.be.equal('admin');
  });

  it('Response body email', async () => {
    expect(chaiHttpResponse.body.user.email).exist;
    expect(chaiHttpResponse.body.user.email).to.be.equal('batman@justiceleague.org');
  });
});
