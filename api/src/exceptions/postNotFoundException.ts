import HttpException from "./httpException";

class PostNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Solicitud con el parámetro ${id} no encontrada`);
  }
}

export default PostNotFoundException;