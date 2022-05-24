import { IMatch, ITeam } from '../interface';

export default class TeamResults {
  public name: string;

  public totalPoints: number;

  public totalGames: number;

  public totalVictories: number;

  public totalDraws: number;

  public totalLosses: number;

  public goalsFavor: number;

  public goalsOwn: number;

  public goalsBalance: number;

  public efficiency: number;

  constructor(team: ITeam, matches: IMatch[], type = 'general') {
    this.name = team.teamName;
    this.totalPoints = 0;
    this.totalGames = 0;
    this.totalVictories = 0;
    this.totalDraws = 0;
    this.totalLosses = 0;
    this.goalsFavor = 0;
    this.goalsOwn = 0;
    this.goalsBalance = 0;
    this.efficiency = 0;
    this.results(team, matches, type);
  }

  private results(team: ITeam, matches: IMatch[], type: string) {
    if (type === 'home' || type === 'general') {
      matches
        .filter((match) => (match.homeTeam === team.id) && !match.inProgress)
        .forEach((match) => this.homeMatch(match));
    }
    if (type === 'away' || type === 'general') {
      matches
        .filter((match) => (match.awayTeam === team.id) && !match.inProgress)
        .forEach((match) => this.awayMatch(match));
    }
    this.goalsBalance = this.goalsFavor - this.goalsOwn;
    this.efficiency = (this.totalPoints / (this.totalGames * 3)) * 100;
    this.efficiency = Number(this.efficiency.toFixed(2));
  }

  private homeMatch(match: IMatch) {
    if (match.homeTeamGoals > match.awayTeamGoals) {
      this.totalPoints += 3;
      this.totalVictories += 1;
    }
    if (match.homeTeamGoals === match.awayTeamGoals) {
      this.totalPoints += 1;
      this.totalDraws += 1;
    }
    if (match.homeTeamGoals < match.awayTeamGoals) this.totalLosses += 1;
    this.goalsFavor += match.homeTeamGoals;
    this.goalsOwn += match.awayTeamGoals;

    this.totalGames += 1;
  }

  private awayMatch(match: IMatch) {
    if (match.awayTeamGoals > match.homeTeamGoals) {
      this.totalPoints += 3;
      this.totalVictories += 1;
    }
    if (match.awayTeamGoals === match.homeTeamGoals) {
      this.totalPoints += 1;
      this.totalDraws += 1;
    }
    if (match.awayTeamGoals < match.homeTeamGoals) this.totalLosses += 1;
    this.goalsFavor += match.awayTeamGoals;
    this.goalsOwn += match.homeTeamGoals;

    this.totalGames += 1;
  }
}
