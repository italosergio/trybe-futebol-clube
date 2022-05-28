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
import { IMatch } from '../interface';

chai.use(chaiHttp);

const { expect } = chai;

let response: Response;

describe('0 - Error middleware', async () => {
    before(async () => {
      response = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'whrong@mail.com',
        password: 'secret',
      });
    })

    it('Throw Error status 500', async () => {
      expect(response).to.have.status(500);
    })

    it('Throw Error message: \'Something whrong!\'', async () => {
      expect(response.body.message).to.be.equal('Something wrong!');
    })
})

describe('1 - POST /login - Correct email and password', () => {
  before(async () => {
    sinon
      .stub(Users, "findOne")
      .resolves({...UserMock} as unknown as Users);

    response = await chai
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

  it('Check status 200', async () => {
    expect(response.status).exist;
    expect(response).to.have.status(200);
  });

  it('Check response body <id>', async () => {
    expect(response.body.user.id).exist;
    expect(response.body.user.id).to.be.equal(1);
  });

  it('Check response body <username>', async () => {
    expect(response.body.user.username).exist;
    expect(response.body.user.username).to.be.equal('batman');
  });

  it('Check response body <role>', async () => {
    expect(response.body.user.role).exist;
    expect(response.body.user.role).to.be.equal('admin');
  });

  it('Check response body <email>', async () => {
    expect(response.body.user.email).exist;
    expect(response.body.user.email).to.be.equal('batman@justiceleague.org');
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
    response = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'incorrect_email',
        password: 'secret_admin'
      });

    expect(response.status).exist;
    expect(response).to.have.status(401);
  });

  it('Return status 401 when <password> is incorrect', async () => {
    response = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'batman@justiceleague.org',
        password: 'incorrect_pass'
      });
      
    expect(response.status).exist;
    expect(response).to.have.status(401);
  });

  it('Check message when <email> is incorrect', async () => {
    response = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'incorrect_email',
        password: 'secret_admin'
      });

    expect(response.body.message).exist;
    expect(response.body.message).to.be.equal('Incorrect email or password');
  });

  it('Check message when <password> is incorrect', async () => {
    response = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'batman@justiceleague.org',
        password: 'incorrect_pass'
      });

    expect(response.body.message).exist;
    expect(response.body.message).to.be.equal('Incorrect email or password');
  });

  it('Check message when <email> does not filled', async () => {
    response = await chai
      .request(app)
      .post('/login')
      .send({
        email: '',
        password: 'secret_admin'
      });

    expect(response.body.message).exist;
    expect(response.body.message).to.be.equal('All fields must be filled');
  });

  it('Check message when <password> does not filled', async () => {
    response = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'batman@justiceleague.org',
        password: ''
      });

    expect(response.body.message).exist;
    expect(response.body.message).to.be.equal('All fields must be filled');
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

    response = await chai
      .request(app)
      .get('/login/validate')
      .set({"authorization": token});
  });

  after(async ()=>{
    sinon.restore();
  })

  it('Check status 200', async () => {
    expect(response.status).exist;
    expect(response).to.have.status(200);
  });

  it('Return \'admin\' role on response text', async () => {
    expect(response.text).exist;
    expect(response.text).to.be.equal("admin");
  });
});

describe('4 - GET /teams - Get all teams', () => {
  before(async () => {
    sinon
      .stub(Teams, "findAll")
      .resolves([...TeamsMock] as unknown as Teams[]);

    response = await chai
      .request(app)
      .get('/teams');
  });

  after(async () => {
    sinon.restore();
  })

  it('Check status 200', async () => {
    expect(response.status).exist;
    expect(response.status).to.be.equal(200);
  });

  it('Check response body <id>', async () => {
    expect(response.body[0].id).exist;
    expect(response.body[0].id).to.be.equal(1);
    
    expect(response.body[1].id).exist;
    expect(response.body[1].id).to.be.equal(2);
  });

  it('Check response body <teamName>', async () => {
    expect(response.body[0].teamName).exist;
    expect(response.body[0].teamName).to.be.equal('Justice League');

    expect(response.body[1].teamName).exist;
    expect(response.body[1].teamName).to.be.equal('Avangers');
  });
});

describe('5 - GET /teams/:id - Get team', async () => {
  before(async () => {
    sinon
      .stub(Teams, "findOne")
      .resolves({...TeamMock} as unknown as Teams);

    response = await chai
      .request(app)
      .get("/teams/1")
  })

  after(async () => {
    sinon.restore()
  })

  it('Check status 200', () => {
    expect(response.status).exist;
    expect(response).to.have.status(200);
  });

  it('Check response body <id>', async () => {
    expect(response.body.id).exist;
    expect(response.body.id).to.be.equal(1);
  });

  it('Check response body <teamName>', async () => {
    expect(response.body.id).exist;
    expect(response.body.teamName).to.be.equal("Justice League");
  });

  it('If :id doesn\'t exists, it shows \"team doesn\'t exist\" message', async () => {
    sinon.restore()

    sinon
    .stub(Teams, "findOne")
    .resolves(null);

    response = await chai
      .request(app)
      .get("/teams/3")

    expect(response.body.message).exist
    expect(response.body.message).to.be.equal('Team doesn\'t exist');
  });
})

describe('6 - GET /matches - Get all matches', () => {
  before(async () => {
    sinon
      .stub(Matches, "findAll")
      .resolves([...MatchesMock] as unknown as Matches[]);

    response = await chai
      .request(app)
      .get('/matches');
  });

  after(async () => {
    sinon.restore();
  })

  it('Check status 200', async () => {
    expect(response.status).exist;
    expect(response.status).to.be.equal(200);
  });

  it('Check response body length', async () => {
    expect(response.body.length).to.be.equal(7);
    
  });

  it('Check response body <id>', async () => {
    expect(response.body[0].id).exist;
    expect(response.body[0].id).to.be.equal(1);
    expect(response.body[1].id).exist;
    expect(response.body[1].id).to.be.equal(2);
    expect(response.body[2].id).exist; 
    expect(response.body[2].id).to.be.equal(3);
    expect(response.body[3].id).exist;
    expect(response.body[3].id).to.be.equal(4);
    expect(response.body[4].id).exist;
    expect(response.body[4].id).to.be.equal(5);
    expect(response.body[5].id).exist;
    expect(response.body[5].id).to.be.equal(6);
    expect(response.body[6].id).exist;
    expect(response.body[6].id).to.be.equal(7);
  });

  it('Check response body <homeTeam>', async () => {
    expect(response.body[0].homeTeam).exist;
    expect(response.body[0].homeTeam).to.be.equal(1);
    expect(response.body[1].homeTeam).exist;
    expect(response.body[1].homeTeam).to.be.equal(2);
    expect(response.body[2].homeTeam).exist; 
    expect(response.body[2].homeTeam).to.be.equal(2);
    expect(response.body[3].homeTeam).exist;
    expect(response.body[3].homeTeam).to.be.equal(2);
    expect(response.body[4].homeTeam).exist;
    expect(response.body[4].homeTeam).to.be.equal(1);
    expect(response.body[5].homeTeam).exist;
    expect(response.body[5].homeTeam).to.be.equal(1);
    expect(response.body[6].homeTeam).exist;
    expect(response.body[6].homeTeam).to.be.equal(1);
  });

  it('Check response body <homeTeamGoals>', async () => {
    expect(response.body[0].homeTeamGoals).exist;
    expect(response.body[0].homeTeamGoals).to.be.equal(7);
    expect(response.body[1].homeTeamGoals).exist;
    expect(response.body[1].homeTeamGoals).to.be.equal(1);
    expect(response.body[2].homeTeamGoals).exist; 
    expect(response.body[2].homeTeamGoals).to.be.equal(3);
    expect(response.body[3].homeTeamGoals).exist;
    expect(response.body[3].homeTeamGoals).to.be.equal(7);
    expect(response.body[4].homeTeamGoals).exist;
    expect(response.body[4].homeTeamGoals).to.be.equal(3);
    expect(response.body[5].homeTeamGoals).exist;
    expect(response.body[5].homeTeamGoals).to.be.equal(11);
    expect(response.body[6].homeTeamGoals).exist;
    expect(response.body[6].homeTeamGoals).to.be.equal(15);
  });

  it('Check response body <awayTeam>', async () => {
    expect(response.body[0].awayTeam).exist;
    expect(response.body[0].awayTeam).to.be.equal(2);
    expect(response.body[1].awayTeam).exist;
    expect(response.body[1].awayTeam).to.be.equal(1);
    expect(response.body[2].awayTeam).exist; 
    expect(response.body[2].awayTeam).to.be.equal(1);
    expect(response.body[3].awayTeam).exist;
    expect(response.body[3].awayTeam).to.be.equal(1);
    expect(response.body[4].awayTeam).exist;
    expect(response.body[4].awayTeam).to.be.equal(2);
    expect(response.body[5].awayTeam).exist;
    expect(response.body[5].awayTeam).to.be.equal(2);
    expect(response.body[6].awayTeam).exist;
    expect(response.body[6].awayTeam).to.be.equal(2);
  });

  it('Check response body <awayTeamGoals>', async () => {
    expect(response.body[0].awayTeamGoals).exist;
    expect(response.body[0].awayTeamGoals).to.be.equal(1);
    expect(response.body[1].awayTeamGoals).exist;
    expect(response.body[1].awayTeamGoals).to.be.equal(7);
    expect(response.body[2].awayTeamGoals).exist; 
    expect(response.body[2].awayTeamGoals).to.be.equal(2);
    expect(response.body[3].awayTeamGoals).exist;
    expect(response.body[3].awayTeamGoals).to.be.equal(7);
    expect(response.body[4].awayTeamGoals).exist;
    expect(response.body[4].awayTeamGoals).to.be.equal(5);
    expect(response.body[5].awayTeamGoals).exist;
    expect(response.body[5].awayTeamGoals).to.be.equal(11);
    expect(response.body[6].awayTeamGoals).exist;
    expect(response.body[6].awayTeamGoals).to.be.equal(13);
  });

  it('Check response body <inProgress>', async () => {
    expect(response.body[0].inProgress).exist;
    expect(response.body[0].inProgress).to.be.equal(true);
    expect(response.body[1].inProgress).exist;
    expect(response.body[1].inProgress).to.be.equal(false);
    expect(response.body[2].inProgress).exist; 
    expect(response.body[2].inProgress).to.be.equal(false);
    expect(response.body[3].inProgress).exist;
    expect(response.body[3].inProgress).to.be.equal(false);
    expect(response.body[4].inProgress).exist;
    expect(response.body[4].inProgress).to.be.equal(false);
    expect(response.body[5].inProgress).exist;
    expect(response.body[5].inProgress).to.be.equal(false);
    expect(response.body[6].inProgress).exist;
    expect(response.body[6].inProgress).to.be.equal(false);
  });

  it('Check response body <teamHome>', async () => {
    expect(response.body[0].teamHome.teamName).exist;
    expect(response.body[0].teamHome.teamName).to.be.equal('Justice League');
    expect(response.body[1].teamHome.teamName).exist;
    expect(response.body[1].teamHome.teamName).to.be.equal('Avangers');
    expect(response.body[2].teamHome.teamName).exist;
    expect(response.body[2].teamHome.teamName).to.be.equal('Avangers');
    expect(response.body[3].teamHome.teamName).exist;
    expect(response.body[3].teamHome.teamName).to.be.equal('Avangers');
    expect(response.body[4].teamHome.teamName).exist;
    expect(response.body[4].teamHome.teamName).to.be.equal('Justice League');
    expect(response.body[5].teamHome.teamName).exist;
    expect(response.body[5].teamHome.teamName).to.be.equal('Justice League');
    expect(response.body[6].teamHome.teamName).exist;
    expect(response.body[6].teamHome.teamName).to.be.equal('Justice League');
  });

  it('Check response body <teamAway>', async () => {
    expect(response.body[0].teamAway.teamName).exist;
    expect(response.body[0].teamAway.teamName).to.be.equal('Avangers');
    expect(response.body[1].teamAway.teamName).exist;
    expect(response.body[1].teamAway.teamName).to.be.equal('Justice League');
    expect(response.body[2].teamAway.teamName).exist;
    expect(response.body[2].teamAway.teamName).to.be.equal('Justice League');
    expect(response.body[3].teamAway.teamName).exist;
    expect(response.body[3].teamAway.teamName).to.be.equal('Justice League');
    expect(response.body[4].teamAway.teamName).exist;
    expect(response.body[4].teamAway.teamName).to.be.equal('Avangers');
    expect(response.body[5].teamAway.teamName).exist;
    expect(response.body[5].teamAway.teamName).to.be.equal('Avangers');
    expect(response.body[6].teamAway.teamName).exist;
    expect(response.body[6].teamAway.teamName).to.be.equal('Avangers');
  });
});

describe('7 - GET /matches?inProgress - Get all matches', () => {
  before(async () => {
    sinon
      .stub(Matches, "findAll")
      .resolves([...MatchesMock] as unknown as Matches[]);

    response = await chai
      .request(app)
      .get('/matches?inProgress=true');
  });

  after(async () => {
    sinon.restore();
  })

  it('Check status 200', async () => {
    expect(response.status).exist;
    expect(response.status).to.be.equal(200);
  });

  it('Check response body <inProgress> all equals true', async () => {
    const matches = response.body
    const everyTrue = matches.every((match: IMatch) => match.inProgress === true )
    
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
  });

  it('When informations is acceptables', async () => {
    response = await chai
      .request(app)
      .post('/matches')
      .send({
        homeTeam: 1, 
        awayTeam: 2, 
        homeTeamGoals: 7,
        awayTeamGoals: 1,
    });

    expect(response.status).exist;
    expect(response).to.have.status(201);
    expect(response.body.id).exist;
    expect(response.body.id).to.be.equal(3);
    expect(response.body.homeTeam).exist;
    expect(response.body.homeTeam).to.be.equal(1);
    expect(response.body.homeTeamGoals).exist;
    expect(response.body.homeTeamGoals).to.be.equal(7);
    expect(response.body.awayTeam).exist;
    expect(response.body.awayTeam).to.be.equal(2);
    expect(response.body.awayTeamGoals).exist;
    expect(response.body.awayTeamGoals).to.be.equal(1);
    expect(response.body.inProgress).exist;
    expect(response.body.inProgress).to.be.equal(false);
  });

  it('When home team and away team are equals', async () => {
    response = await chai
      .request(app)
      .post('/matches')
      .send({
        homeTeam: 1, 
        awayTeam: 1, 
        homeTeamGoals: 7,
        awayTeamGoals: 1,
    });

    expect(response.status).exist;
    expect(response).to.have.status(401);
    expect(response.body.message).exist;
    expect(response.body.message).to.be.equal("It is not possible to create a match with two equal teams");
  });

  it('When one of the teams does not exist in the database', async () => {
    sinon
      .stub(Teams, "findOne")
      .resolves(null);

    response = await chai
      .request(app)
      .post('/matches')
      .send({
        homeTeam: 99, 
        awayTeam: 1, 
        homeTeamGoals: 7,
        awayTeamGoals: 1,
    });

    expect(response.status).exist;
    expect(response).to.have.status(404);
    expect(response.body.message).exist;
    expect(response.body.message).to.be.equal("There is no team with such id!");
  });
});

describe('9 - PATCH /matches/:id - Update in progress match score', () => {
  before(async () => {
    sinon
      .stub(Matches, "update")
      .resolves(undefined);

    response = await chai
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

  it('Check status 200', async () => {
    expect(response.status).exist;
    expect(response).to.have.status(200);
  });

  it('Message \'Score updated\'', async () => {
    expect(response.body.message).exist;
    expect(response.body.message).to.be.equal("Score updated");
  });
});

describe('10 - PATCH /matches/:id/finish - Update in progress match to finished', () => {
  before(async () => {
    sinon
      .stub(Matches, "update")
      .resolves(undefined);

    response = await chai
      .request(app)
      .patch('/matches/1/finish')
  });

  after(async ()=>{
    sinon.restore();
  });

  it('Check status 200', async () => {
    expect(response.status).exist;
    expect(response).to.have.status(200);
  });

  it('Message \'Finished\'', async () => {
    expect(response.body.message).exist;
    expect(response.body.message).to.be.equal("Finished");
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

    response = await chai
      .request(app)
      .get('/leaderboard/home')
  });

  after(async ()=>{
    sinon.restore();
  });

  it('Check status 200', async () => {
    expect(response.status).exist;
    expect(response).to.have.status(200);
  });

  it('Check response body', async () => {
    expect(response.body.length).to.be.equal(2);
    expect(response.body[0].name).to.be.equal('Justice League');
    expect(response.body[0].totalPoints).to.be.equal(4);
    expect(response.body[0].totalGames).to.be.equal(3);
    expect(response.body[0].totalVictories).to.be.equal(1);
    expect(response.body[0].totalDraws).to.be.equal(1);
    expect(response.body[0].totalLosses).to.be.equal(1);
    expect(response.body[0].goalsFavor).to.be.equal(29);
    expect(response.body[0].goalsOwn).to.be.equal(29);
    expect(response.body[0].goalsBalance).to.be.equal(0);
    expect(response.body[0].efficiency).to.be.deep.equal(44.44);

    expect(response.body[1].name).to.be.equal('Avangers');
    expect(response.body[1].totalPoints).to.be.equal(4);
    expect(response.body[1].totalGames).to.be.equal(3);
    expect(response.body[1].totalVictories).to.be.equal(1);
    expect(response.body[1].totalDraws).to.be.equal(1);
    expect(response.body[1].totalLosses).to.be.equal(1);
    expect(response.body[1].goalsFavor).to.be.equal(11);
    expect(response.body[1].goalsOwn).to.be.equal(16);
    expect(response.body[1].goalsBalance).to.be.equal(-5);
    expect(response.body[1].efficiency).to.be.deep.equal(44.44);
  });
});

describe('12 - GET /leaderboard/away - Get away teams leaderboard results', () => {
  before(async () => {
    sinon
      .stub(Matches, "findAll")
      .resolves([...MatchesMock] as unknown as Matches[]);

      sinon
      .stub(Teams, "findAll")
      .resolves([...TeamsMock] as unknown as Teams[]);

    response = await chai
      .request(app)
      .get('/leaderboard/away')
  });

  after(async ()=>{
    sinon.restore();
  });

  it('Check status 200', async () => {
    expect(response.status).exist;
    expect(response).to.have.status(200);
  });

  it('Check response body', async () => {
    expect(response.body.length).to.be.equal(2);
    expect(response.body[0].name).to.be.equal('Justice League');
    expect(response.body[0].totalPoints).to.be.equal(4);
    expect(response.body[0].totalGames).to.be.equal(3);
    expect(response.body[0].totalVictories).to.be.equal(1);
    expect(response.body[0].totalDraws).to.be.equal(1);
    expect(response.body[0].totalLosses).to.be.equal(1);
    expect(response.body[0].goalsFavor).to.be.equal(16);
    expect(response.body[0].goalsOwn).to.be.equal(11);
    expect(response.body[0].goalsBalance).to.be.equal(5);
    expect(response.body[0].efficiency).to.be.equal(44.44);
    expect(response.body[1].name).to.be.equal('Avangers');
    expect(response.body[1].totalPoints).to.be.equal(4);
    expect(response.body[1].totalGames).to.be.equal(3);
    expect(response.body[1].totalVictories).to.be.equal(1);
    expect(response.body[1].totalDraws).to.be.equal(1);
    expect(response.body[1].totalLosses).to.be.equal(1);
    expect(response.body[1].goalsFavor).to.be.equal(29);
    expect(response.body[1].goalsOwn).to.be.equal(29);
    expect(response.body[1].goalsBalance).to.be.equal(0);
    expect(response.body[1].efficiency).to.be.equal(44.44);
  });
});

describe('13 - GET /leaderboard - Get general leaderboard results', () => {
  before(async () => {
    sinon
      .stub(Matches, "findAll")
      .resolves([...MatchesMock] as unknown as Matches[]);

      sinon
      .stub(Teams, "findAll")
      .resolves([...TeamsMock] as unknown as Teams[]);

    response = await chai
      .request(app)
      .get('/leaderboard')
  });

  after(async ()=>{
    sinon.restore();
  });

  it('Check status 200', async () => {
    expect(response.status).exist;
    expect(response).to.have.status(200);
  });

  it('Check response body', async () => {
    expect(response.body.length).to.be.equal(2);
    expect(response.body[0].name).to.be.equal('Justice League');
    expect(response.body[0].totalPoints).to.be.equal(8);
    expect(response.body[0].totalGames).to.be.equal(6);
    expect(response.body[0].totalVictories).to.be.equal(2);
    expect(response.body[0].totalDraws).to.be.equal(2);
    expect(response.body[0].totalLosses).to.be.equal(2);
    expect(response.body[0].goalsFavor).to.be.equal(45);
    expect(response.body[0].goalsOwn).to.be.equal(40);
    expect(response.body[0].goalsBalance).to.be.equal(5);
    expect(response.body[0].efficiency).to.be.equal(44.44);
    expect(response.body[1].name).to.be.equal('Avangers');
    expect(response.body[1].totalPoints).to.be.equal(8);
    expect(response.body[1].totalGames).to.be.equal(6);
    expect(response.body[1].totalVictories).to.be.equal(2);
    expect(response.body[1].totalDraws).to.be.equal(2);
    expect(response.body[1].totalLosses).to.be.equal(2);
    expect(response.body[1].goalsFavor).to.be.equal(40);
    expect(response.body[1].goalsOwn).to.be.equal(45);
    expect(response.body[1].goalsBalance).to.be.equal(-5);
    expect(response.body[1].efficiency).to.be.equal(44.44);
  });
});