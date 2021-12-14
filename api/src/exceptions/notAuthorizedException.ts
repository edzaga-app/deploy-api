import HttpException from "./httpException";

class NotAuthorizedException extends HttpException {
  constructor() {
    super(403, 'No esta autorizado');
  }
}

export default NotAuthorizedException;