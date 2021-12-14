import express from 'express';
import cors from 'cors';
import Route from './models/route';

class App {
  public app: express.Application;
  
  constructor(routes: Route[]) {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`Server on port ${process.env.PORT}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.static('uploads'));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach(route => {
      this.app.use('/api/v1', route.router);
    });
  }

  public getServer() {
    return this.app;
  }
}

export default App;