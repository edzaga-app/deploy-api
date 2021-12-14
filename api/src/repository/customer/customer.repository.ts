import ICustomer from "../../models/customer.interface";
import CrudRepository from "../crud.repository";
import { CustomerSql } from "./sql/customer.sql";

class CustomerRepository extends CrudRepository {
  
  constructor() { 
    super();
  }

  public async saveOrUpdate(customer: ICustomer): Promise<ICustomer | null> {
    try {
      if (customer.customerId == 0) {
        const res = await this.executeQuery<ICustomer>(CustomerSql.save,[customer.id, customer.name, customer.lastname,
          customer.age.toString(), customer.cellphone, customer.email, customer.address, 
          customer.cityId.toString(), customer.fileId.toString(), customer.isActive]);
        return res.affectedRows;
      } else {
        const res = await this.executeQuery<ICustomer>(CustomerSql.update,[customer.id,customer.name,customer.lastname, 
          customer.age.toString(), customer.cellphone, customer.email, customer.address, customer.cityId.toString(), customer.fileId.toString(), 
          customer.isActive, customer.customerId.toString()]);
        return res.affectedRows;
      }
    } catch (error) {
      throw new Error("error en saveOrUpdate" + error);
    }
    return null;
  }

  public async getAll(): Promise<ICustomer | null> {
    const res = await this.executeQuery<ICustomer[]>(CustomerSql.getAll,[]);
    return res;
  }

  public async deleteById(customerId: string): Promise<ICustomer | null> {
    const res = await this.executeQuery<ICustomer>(CustomerSql.deleteById,[customerId.toString()]);
    return res;
  }

    public async getById(customerId: string): Promise<ICustomer | null> {
    const res = await this.executeQuery<ICustomer[]>(CustomerSql.getById,[customerId]);
    return res;
  }

}

export default CustomerRepository;