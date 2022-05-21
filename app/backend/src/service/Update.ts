import { Match } from '../model';
export default class Update {
  static async matchFinish(id: string) {
    return await Match.finish(id)
  }
}