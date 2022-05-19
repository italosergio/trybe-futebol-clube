export default interface IUser {
  id: number,
  username: string,
  role: 'admin' | 'user',
  email: string,
  password: string,
}
