import IGeneric from "../../models/generic.interface";
import CrudRepository from "../crud.repository";
import { LocationSql } from "./sql/location.sql";

 class LocationRepository extends CrudRepository {

    constructor() { 
        super();
    }

    public async getCountries(): Promise<IGeneric | null> {
        const res = await this.executeQuery<IGeneric[]>(LocationSql.getCountries,[]);
        return res;
    }

    public async getStates(id:string): Promise<IGeneric | null> {
        const res = await this.executeQuery<IGeneric[]>(LocationSql.getStates,[id.toString()]);
        return res;
    }

    public async getCities(id:string): Promise<IGeneric | null> {
        const res = await this.executeQuery<IGeneric[]>(LocationSql.getCities,[id.toString()]);
        return res;
    }
}

export default LocationRepository;