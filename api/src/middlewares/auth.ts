import { Request, Response, NextFunction, Router } from 'express';
import jwt from 'jsonwebtoken';
import TokenData from '../models/tokenData';

class Auth {
  public router = Router();

  constructor() { }

  public auth = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers["authorization"];
    let request: any;
    if (!token) {
      return res.status(401).json({
        auth: false,
        message: 'Acceso denegado, no tiene un token válido' 
      });
    }

    try {
      // Se configura para que llegue en authorization desde un interceptor en el front-end
      if (token.includes('Bearer')) {
        token = token.replace('Bearer ', '');
      }
      const decode = jwt.verify(token, process.env.ACCESSKEY!);
      /*
      * Como la propiedad req.user es solo para los usarios que iniciaron session
      * y tiene información de session. Para este caso la aplicación se accede desde
      * otra apliación que genera el token, por esta razón toca mutar el objeto req
      * creando una nueva propiedad
      */
      request = req;
      request.user = decode;
      req = request;
      next();

    } catch (err) {
      res.status(400).json({
        auth: false,
        message: 'El token es inválido'
      });
    }

  }

  /**
   * Genera un token con los datos encriptados
   * @param fieldsEncript Objeto con los campos a encriptar
   * @returns token
   */
  public createToken(fieldsEncript: object): TokenData {
    const expiresIn = 60 * 60 * 24; // En segundos (un día)
    return {
      expiresIn: expiresIn,
      token: jwt.sign(fieldsEncript, process.env.ACCESSKEY!, {expiresIn})
    };
  }

}

export default Auth;