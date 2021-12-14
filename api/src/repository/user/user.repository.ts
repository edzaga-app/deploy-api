import IUser from "../../models/user.interface";
import CrudRepository from "../crud.repository";
import { UserSql } from './sql/user.sql'

class UserRepository extends CrudRepository {
  
  constructor() { 
    super();
  }
  
  public async getUser(user: string, password: string): Promise<IUser | null> {
    const validateUser = await this.executeQuery<IUser>(UserSql.getUser, [user, password]);
    return validateUser[0];
  }


}

export default UserRepository;