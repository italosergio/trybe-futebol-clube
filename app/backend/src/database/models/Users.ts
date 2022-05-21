import { STRING, INTEGER, Model } from 'sequelize';
import db from '.';

class Users extends Model {
  public id!: number;

  public username!: string;

  public role!: 'admin' | 'user';

  public email!: string;

  public password!: string;
}

Users.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: STRING(20),
    allowNull: false,
  },
  role: {
    type: STRING(5),
    allowNull: false,
  },
  email: {
    type: STRING(100),
    allowNull: false,
  },
  password: {
    type: STRING(30),
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'Users',
  timestamps: false,
});

export default Users;
