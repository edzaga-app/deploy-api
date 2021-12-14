import { NextFunction, Request, Response, Router } from 'express';
import ICustomer from '../models/customer.interface';
import Route from "../models/route";
import CustomerRepository from '../repository/customer/customer.repository';

class CustomerController implements Route {
  public path = '/customers';
  public router = Router();
  private className = 'CustomerController';
  private customerRepository = new CustomerRepository();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.saveOrUpdate);
    this.router.get(`${this.path}`, this.getAll);
    this.router.delete(`${this.path}/:customerId`, this.deleteById);
    this.router.get(`${this.path}/:customerId`, this.getById);

  }

  saveOrUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let customer: ICustomer
      customer = req.body;
      const response = await this.customerRepository.saveOrUpdate(customer);
      if (response != null) {
        res.json({ "rowsAffected": response });
        console.log(`Transaction successful ${this.className},Rows affected :${response}`)
      }

    } catch (err) {
      console.error(`Error en ${this.className} => saveOrUpdate`, err);
      res.status(400).json({ error: true });
    }
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.customerRepository.getAll();
      res.json({ "res": response });
      console.log(`Transaction successful ${this.className} => getAll`)
    } catch (err) {
      console.error(`Error en ${this.className} => getAll`, err);
      res.json({ error: true });
    }
  }

  deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {customerId} = req.params;
      const response = await this.customerRepository.deleteById(customerId);
      res.json({ "res": response });
      console.log(`Transaction successful ${this.className} => deleteById`)
    } catch (err) {
      console.error(`Error en ${this.className} => deleteById`, err);
      res.json({ error: true });
    }
  }

    getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {customerId} = req.params;
      const response = await this.customerRepository.getById(customerId);
      res.json({ "res": response });
      console.log(`Transaction successful ${this.className} => getById`)
    } catch (err) {
      console.error(`Error en ${this.className} => getById`, err);
      res.json({ error: true });
    }
  }

}

export default CustomerController;