import { IUser } from '../../interface/';

const user: IUser = {
  id: 1,
  username: 'batman',
  email: 'batman@justiceleague.org',
  role: 'admin',
  password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW' // secret_admin
}

const UserMock = user;

export default UserMock;