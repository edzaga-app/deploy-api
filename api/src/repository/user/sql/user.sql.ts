export enum UserSql {
  
  getUser = `select * from users u where u.user = ? and u.password = ?`


}