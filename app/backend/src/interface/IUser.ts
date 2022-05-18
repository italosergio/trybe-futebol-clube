export default interface IUser {
  id: number,
  username: string,
  role: 'Admin' | 'User',
  email: string,
  password: string,
}
