import 'mocha';
import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import Users from '../database/models/Users';
import Teams from '../database/models/Teams';
import Matches from '../database/models/Matches';
import { app } from '../app';
import { Response } from 'superagent';
import { MatchesMock, TeamMock, TeamsMock, UserMock } from './mocks';

chai.use(chaiHttp);

const { expect } = chai;

let chaiHttpResponse: Response;

describe('0 - Error middleware', async () => {
    before(async () => {
      chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'whrong@mail.com',
        password: 'secret',
      });
    })

    it('Throw Error status 500', async () => {
      expect(chaiHttpResponse).to.have.status(500);
    })

    it('Throw Error message: \'Something whrong!\'', async () => {
      expect(chaiHttpResponse.body.message).to.be.equal('Something wrong!');
    })
})

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
    sinon.restore();
  })

  it('Status 200', async () => {
    expect(chaiHttpResponse.status).exist;
    expect(chaiHttpResponse).to.have.status(200);
  });

  it('Response body <id>', async () => {
    expect(chaiHttpResponse.body.user.id).exist;
    expect(chaiHttpResponse.body.user.id).to.be.equal(1);
  });

  it('Response body <username>', async () => {
    expect(chaiHttpResponse.body.user.username).exist;
    expect(chaiHttpResponse.body.user.username).to.be.equal('batman');
  });

  it('Response body <role>', async () => {
    expect(chaiHttpResponse.body.user.role).exist;
    expect(chaiHttpResponse.body.user.role).to.be.equal('admin');
  });

  it('Response body <email>', async () => {
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
    sinon.restore();
  });

  it('Return status 401 when <email> is incorrect', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'incorrect_email',
        password: 'secret_admin'
      });

    expect(chaiHttpResponse.status).exist;
    expect(chaiHttpResponse).to.have.status(401);
  });

  it('Return status 401 when <password> is incorrect', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'batman@justiceleague.org',
        password: 'incorrect_pass'
      });
      
    expect(chaiHttpResponse.status).exist;
    expect(chaiHttpResponse).to.have.status(401);
  });

  it('Check message when <email> is incorrect', async () => {
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

  it('Check message when <password> is incorrect', async () => {
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

  it('Check message when <email> does not filled', async () => {
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

  it('Check message when <password> does not filled', async () => {
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
      .set({"authorization": token});
  });

  after(async ()=>{
    sinon.restore();
  })

  it('Status 200', async () => {
    expect(chaiHttpResponse.status).exist;
    expect(chaiHttpResponse).to.have.status(200);
  });

  it('Return \'admin\' role on response text', async () => {
    expect(chaiHttpResponse.text).exist;
    expect(chaiHttpResponse.text).to.be.equal("admin");
  });
});

describe('4 - GET /teams - Get all teams', () => {
  before(async () => {
    sinon
      .stub(Teams, "findAll")
      .resolves([...TeamsMock] as unknown as Teams[]);

    chaiHttpResponse = await chai
      .request(app)
      .get('/teams');
  });

  after(async () => {
    sinon.restore();
  })

  it('Status 200', async () => {
    expect(chaiHttpResponse.status).exist;
    expect(chaiHttpResponse.status).to.be.equal(200);
  });

  it('Response body <id>', async () => {
    expect(chaiHttpResponse.body[0].id).exist;
    expect(chaiHttpResponse.body[0].id).to.be.equal(1);
    
    expect(chaiHttpResponse.body[1].id).exist;
    expect(chaiHttpResponse.body[1].id).to.be.equal(2);
  });

  it('Response body <teamName>', async () => {
    expect(chaiHttpResponse.body[0].teamName).exist;
    expect(chaiHttpResponse.body[0].teamName).to.be.equal('Justice League');

    expect(chaiHttpResponse.body[1].teamName).exist;
    expect(chaiHttpResponse.body[1].teamName).to.be.equal('Avangers');
  });
});

describe('5 - GET /teams/:id - Get team', async () => {
  before(async () => {
    sinon
      .stub(Teams, "findOne")
      .resolves({...TeamMock} as unknown as Teams);

    chaiHttpResponse = await chai
      .request(app)
      .get("/teams/2")
  })

  after(async () => {
    sinon.restore()
  })

  it('Status 200', () => {
    expect(chaiHttpResponse.status).exist;
    expect(chaiHttpResponse).to.have.status(200);
  })

  it('Response body <id>', async () => {
    expect(chaiHttpResponse.body.id).exist;
    expect(chaiHttpResponse.body.id).to.be.equal(1);
  });

  it('Response body <teamName>', async () => {
    expect(chaiHttpResponse.body.id).exist;
    expect(chaiHttpResponse.body.id).to.be.equal(1);
  });
})

describe('6 - GET /matches - Get all matches', () => {
  before(async () => {
    sinon
      .stub(Matches, "findAll")
      .resolves([...MatchesMock] as unknown as Matches[]);

    chaiHttpResponse = await chai
      .request(app)
      .get('/matches');
  });

  after(async () => {
    sinon.restore();
  })

  it('Status 200', async () => {
    expect(chaiHttpResponse.status).exist;
    expect(chaiHttpResponse.status).to.be.equal(200);
  });

  it('Response body <id>', async () => {
    expect(chaiHttpResponse.body[0].id).exist;
    expect(chaiHttpResponse.body[0].id).to.be.equal(1);
    
    expect(chaiHttpResponse.body[1].id).exist;
    expect(chaiHttpResponse.body[1].id).to.be.equal(2);
  });

  it('Response body <homeTeam>', async () => {
    expect(chaiHttpResponse.body[0].homeTeam).exist;
    expect(chaiHttpResponse.body[0].homeTeam).to.be.equal(1);

    expect(chaiHttpResponse.body[1].homeTeam).exist;
    expect(chaiHttpResponse.body[1].homeTeam).to.be.equal(2);
  });

  it('Response body <homeTeamGoals>', async () => {
    expect(chaiHttpResponse.body[0].homeTeamGoals).exist;
    expect(chaiHttpResponse.body[0].homeTeamGoals).to.be.equal(7);

    expect(chaiHttpResponse.body[1].homeTeamGoals).exist;
    expect(chaiHttpResponse.body[1].homeTeamGoals).to.be.equal(1);
  });

  it('Response body <awayTeam>', async () => {
    expect(chaiHttpResponse.body[0].awayTeam).exist;
    expect(chaiHttpResponse.body[0].awayTeam).to.be.equal(2);

    expect(chaiHttpResponse.body[1].awayTeam).exist;
    expect(chaiHttpResponse.body[1].awayTeam).to.be.equal(1);
  });

  it('Response body <awayTeamGoals>', async () => {
    expect(chaiHttpResponse.body[0].awayTeamGoals).exist;
    expect(chaiHttpResponse.body[0].awayTeamGoals).to.be.equal(1);

    expect(chaiHttpResponse.body[1].awayTeamGoals).exist;
    expect(chaiHttpResponse.body[1].awayTeamGoals).to.be.equal(7);
  });

  it('Response body <inProgress>', async () => {
    expect(chaiHttpResponse.body[0].inProgress).exist;
    expect(chaiHttpResponse.body[0].inProgress).to.be.equal(false);

    expect(chaiHttpResponse.body[1].inProgress).exist;
    expect(chaiHttpResponse.body[1].inProgress).to.be.equal(true);
  });

  it('Response body <teamHome>', async () => {
    expect(chaiHttpResponse.body[0].teamHome.teamName).exist;
    expect(chaiHttpResponse.body[0].teamHome.teamName).to.be.equal('Justice League');

    expect(chaiHttpResponse.body[1].teamHome.teamName).exist;
    expect(chaiHttpResponse.body[1].teamHome.teamName).to.be.equal('Avangers');
  });

  it('Response body <teamAway>', async () => {
    expect(chaiHttpResponse.body[0].teamAway.teamName).exist;
    expect(chaiHttpResponse.body[0].teamAway.teamName).to.be.equal('Avangers');
    
    expect(chaiHttpResponse.body[1].teamAway.teamName).exist;
    expect(chaiHttpResponse.body[1].teamAway.teamName).to.be.equal('Justice League');
  });
});

describe('7 - GET /matches?inProgress - Get all matches', () => {
  before(async () => {
    sinon
      .stub(Matches, "findAll")
      .resolves([
        {
          id: 1,
          homeTeam: 1,
          homeTeamGoals: 7,
          awayTeam: 2,
          awayTeamGoals: 1,
          inProgress: true,
          teamHome: {
            teamName: "Justice League"
          },
          teamAway: {
            teamName: "Avangers"
          }
        },
        {
          id: 2,
          homeTeam: 2,
          homeTeamGoals: 1,
          awayTeam: 1,
          awayTeamGoals: 7,
          inProgress: false,
          teamHome: {
            teamName: "Avangers"
          },
          teamAway: {
            teamName: "Justice League"
          }
        },
      ] as unknown as Matches[]);

    chaiHttpResponse = await chai
      .request(app)
      .get('/matches?inProgress=true');
  });

  after(async () => {
    sinon.restore();
  })

  it('Status 200', async () => {
    expect(chaiHttpResponse.status).exist;
    expect(chaiHttpResponse.status).to.be.equal(200);
  });

  it('Response body <inProgress> all equals true', async () => {
    const matches = chaiHttpResponse.body
    const everyTrue = matches.every((match) => match.inProgress === true )
    
    expect(everyTrue).to.be.equal(true);
  });
});

describe('8 - POST /matches - Create match', () => {
  before(async () => {
    sinon
      .stub(Matches, "create")
      .resolves(undefined);

    sinon
      .stub(Matches, "findOne")
      .resolves({
        id: 3,
        homeTeam: 1,
        homeTeamGoals: 7,
        awayTeam: 2,
        awayTeamGoals: 1,
        inProgress: false,
      } as unknown as Matches);
  });

  after(async ()=>{
    sinon.restore();
    sinon.restore();
    sinon.restore();
  });

  it('When informations is acceptables', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .send({
        homeTeam: 1, 
        awayTeam: 2, 
        homeTeamGoals: 7,
        awayTeamGoals: 1,
    });

    expect(chaiHttpResponse.status).exist;
    expect(chaiHttpResponse).to.have.status(201);
    expect(chaiHttpResponse.body.id).exist;
    expect(chaiHttpResponse.body.id).to.be.equal(3);
    expect(chaiHttpResponse.body.homeTeam).exist;
    expect(chaiHttpResponse.body.homeTeam).to.be.equal(1);
    expect(chaiHttpResponse.body.homeTeamGoals).exist;
    expect(chaiHttpResponse.body.homeTeamGoals).to.be.equal(7);
    expect(chaiHttpResponse.body.awayTeam).exist;
    expect(chaiHttpResponse.body.awayTeam).to.be.equal(2);
    expect(chaiHttpResponse.body.awayTeamGoals).exist;
    expect(chaiHttpResponse.body.awayTeamGoals).to.be.equal(1);
    expect(chaiHttpResponse.body.inProgress).exist;
    expect(chaiHttpResponse.body.inProgress).to.be.equal(false);
  });

  it('When home team and away team are equals', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .send({
        homeTeam: 1, 
        awayTeam: 1, 
        homeTeamGoals: 7,
        awayTeamGoals: 1,
    });

    expect(chaiHttpResponse.status).exist;
    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body.message).exist;
    expect(chaiHttpResponse.body.message).to.be.equal("It is not possible to create a match with two equal teams");
  });

  it('When one of the teams does not exist in the database', async () => {
    sinon
      .stub(Teams, "findOne")
      .resolves(null);

    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .send({
        homeTeam: 99, 
        awayTeam: 1, 
        homeTeamGoals: 7,
        awayTeamGoals: 1,
    });

    expect(chaiHttpResponse.status).exist;
    expect(chaiHttpResponse).to.have.status(404);
    expect(chaiHttpResponse.body.message).exist;
    expect(chaiHttpResponse.body.message).to.be.equal("There is no team with such id!");
  });
});

describe('9 - PATCH /matches/:id - Update in progress match score', () => {
  before(async () => {
    sinon
      .stub(Matches, "update")
      .resolves(undefined);

    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/1')
      .send({
        homeTeamGoals: 8,
        awayTeamGoals: 3,
    });
  });

  after(async ()=>{
    sinon.restore();
  });

  it('Status 200', async () => {
    expect(chaiHttpResponse.status).exist;
    expect(chaiHttpResponse).to.have.status(200);
  });

  it('Message \'Score updated\'', async () => {
    expect(chaiHttpResponse.body.message).exist;
    expect(chaiHttpResponse.body.message).to.be.equal("Score updated");
  });
});

describe('10 - PATCH /matches/:id/finish - Update in progress match to finished', () => {
  before(async () => {
    sinon
      .stub(Matches, "update")
      .resolves(undefined);

    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/1/finish')
  });

  after(async ()=>{
    sinon.restore();
  });

  it('Status 200', async () => {
    expect(chaiHttpResponse.status).exist;
    expect(chaiHttpResponse).to.have.status(200);
  });

  it('Message \'Finished\'', async () => {
    expect(chaiHttpResponse.body.message).exist;
    expect(chaiHttpResponse.body.message).to.be.equal("Finished");
  });
});

describe('11 - GET /leaderboard/home - Get teams classification', () => {
  before(async () => {
    sinon
      .stub(Matches, "findAll")
      .resolves([...MatchesMock] as unknown as Matches[]);

      sinon
      .stub(Teams, "findAll")
      .resolves([...TeamsMock] as unknown as Teams[]);

    chaiHttpResponse = await chai
      .request(app)
      .get('/leaderboard/home')
  });

  after(async ()=>{
    sinon.restore();
  });

  it('Status 200', async () => {
    expect(chaiHttpResponse.status).exist;
    expect(chaiHttpResponse).to.have.status(200);
  });

  it('Body payload is acceptable', async () => {
    expect(chaiHttpResponse.body[0]).exist;
    expect(chaiHttpResponse.body[1]).exist;
    expect(chaiHttpResponse.body[0].name).to.be.equal('Justice League');
    expect(chaiHttpResponse.body[0].totalPoints).to.be.equal(3);
    expect(chaiHttpResponse.body[0].totalGames).to.be.equal(1);
    expect(chaiHttpResponse.body[0].totalVictories).to.be.equal(1);
    expect(chaiHttpResponse.body[0].totalDraws).to.be.equal(0);
    expect(chaiHttpResponse.body[0].totalLosses).to.be.equal(0);
    expect(chaiHttpResponse.body[0].goalsFavor).to.be.equal(7);
    expect(chaiHttpResponse.body[0].goalsOwn).to.be.equal(1);
    expect(chaiHttpResponse.body[0].goalsBalance).to.be.equal(6);
    expect(chaiHttpResponse.body[0].efficiency).to.be.equal(100);
  });
});