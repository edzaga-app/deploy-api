import { Request, Response, NextFunction, Router } from 'express';
import Auth from '../middlewares/auth';
import Route from "../models/route";;
import UserRepository from '../repository/user/user.repository';


class AuthController implements Route {
  path = '/auth';
  router = Router();
  className = 'AuthController';
  private userRepository = new UserRepository();
  private auth = new Auth();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, this.login);
  } 

  login = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, password } = req.body;
      const validateUser = await this.userRepository.getUser(user, password);
      if (!validateUser?.userId) {
        res.json({ error: true });
      }
      const token = this.auth.createToken({id: validateUser?.userId });
      res.send(token);

    } catch (err) {
      console.error(`Error en ${this.className} => login`, err);
      res.json({ error: true });
    }
  }


}

export default AuthController;