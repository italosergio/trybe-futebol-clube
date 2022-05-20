import { Matches } from '../model';

export default class Create {
  static async match(values) {
    return Matches.insert(values);
  }
}
