import { Match } from '../model';

export default class Update {
  static async matchFinish(id: string) {
    return Match.finish(id);
  }

  static async matchScore(id: string, homeTeamGoals: number, awayTeamGoals: number) {
    return Match.score(id, homeTeamGoals, awayTeamGoals);
  }
}
