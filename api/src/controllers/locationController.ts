import { NextFunction, Request, Response, Router } from 'express';
import Route from "../models/route";
import LocationRepository from "../repository/location/locationRepository";

class LocationController implements Route {
    public path = '/location';
    public router = Router();
    private className = 'LocationController';
    private locationRepository = new LocationRepository();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}` + '/countries', this.getCountries);
        this.router.get(`${this.path}` + '/states/:id', this.getStates);
        this.router.get(`${this.path}`+'/cities/:id', this.getCities);

    }

    getCountries = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.locationRepository.getCountries();
            res.json({ "res": response });
            console.log(`Transaction successful ${this.className} => getCountries`)
        } catch (err) {
            console.error(`Error en ${this.className} => getCountries`, err);
            res.json({ error: true });
        }
    }

    getStates = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const response = await this.locationRepository.getStates(id);
            res.json({ "res": response });
            console.log(`Transaction successful ${this.className} => getStates`)
        } catch (err) {
            console.error(`Error en ${this.className} => getStates`, err);
            res.json({ error: true });
        }
    }

    getCities = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const response = await this.locationRepository.getCities(id);
            res.json({ "res": response });
            console.log(`Transaction successful ${this.className} => getStates`)
        } catch (err) {
            console.error(`Error en ${this.className} => getStates`, err);
            res.json({ error: true });
        }
    }

}

export default LocationController;