import { Match } from '../model';

export default class Create {
  static async match(values) {
    return Match.insert(values);
  }
}
