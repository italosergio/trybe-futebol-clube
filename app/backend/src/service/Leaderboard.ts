import { IMatch, ITeam, ITeamResults } from '../interface';
import TeamResults from './TeamResults';

export default class Leaderboard {
  private _leaderbord: ITeamResults[];

  constructor(teams: ITeam[], matches: IMatch[]) {
    this._leaderbord = teams
      .map((team) => new TeamResults(team, matches))
      .sort((a, b) =>
        b.totalPoints - a.totalPoints
        || b.totalVictories - a.totalVictories
        || b.goalsBalance - a.goalsBalance
        || b.goalsFavor - a.goalsFavor
        || a.goalsOwn - b.goalsOwn);
  }

  get leaderboard() {
    return [...this._leaderbord];
  }
}
