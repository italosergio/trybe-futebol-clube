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

describe('2 - POST /login - Incorrect email and password', () => {
  before(async () => {
    sinon
      .stub(Users, "findOne")
      .resolves({...UserMock} as unknown as Users);
  });

  after(async ()=>{
    (Users.findOne as sinon.SinonStub).restore();
  })

  it('Return status 401 when email is incorrect', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'incorrect_email',
        password: 'secret_admin'
      });

    expect(chaiHttpResponse.status).exist;
    expect(chaiHttpResponse.status).to.be.equal(401);
  });

  it('Return status 401 when password is incorrect', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'batman@justiceleague.org',
        password: 'incorrect_pass'
      });
      
    expect(chaiHttpResponse.status).exist;
    expect(chaiHttpResponse.status).to.be.equal(401);
  });

  it('Check message when email is incorrect', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'incorrect_email',
        password: 'secret_admin'
      });

    expect(chaiHttpResponse.body.message).exist;
    expect(chaiHttpResponse.body.message).to.be.equal('Incorrect email or password');
  });

  it('Check message when password is incorrect', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'batman@justiceleague.org',
        password: 'incorrect_pass'
      });

    expect(chaiHttpResponse.body.message).exist;
    expect(chaiHttpResponse.body.message).to.be.equal('Incorrect email or password');
  });

  it('Check message when email does not filled', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        email: '',
        password: 'secret_admin'
      });

    expect(chaiHttpResponse.body.message).exist;
    expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled');
  });

  it('Check message when password does not filled', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'batman@justiceleague.org',
        password: ''
      });

    expect(chaiHttpResponse.body.message).exist;
    expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled');
  });
});

describe('3 - GET /login/validate - Token validate', () => {
  before(async () => {
    sinon
      .stub(Users, "findOne")
      .resolves({...UserMock} as unknown as Users);
    
    const { body: { token } } = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'batman@justiceleague.org',
        password: 'secret_admin'
      });

    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set({"authorization": token})
  });

  after(async ()=>{
    (Users.findOne as sinon.SinonStub).restore();
  })

  it('Return status 200', async () => {
    expect(chaiHttpResponse.status).exist;
    expect(chaiHttpResponse.status).to.be.equal(200);
  });

  it('Return \'admin\' role text', async () => {
    expect(chaiHttpResponse.text).exist;
    expect(chaiHttpResponse.text).to.be.equal("admin");
  });
});
