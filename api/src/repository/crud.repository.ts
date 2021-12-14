import { connect } from '../config/config';

class CrudRepository {
  className = 'CrudRepository';
  
  constructor() { }

  public async executeQuery<T>(sql: string, params: Array<string>): Promise<T[] | any> {
    let res = null;
    let conn;
    try {
      conn = await connect();
      const result = await conn.query(sql, params,);
      res = result?.[0] ? result[0] : null;

    } catch (err) {
      console.error(`Error en ${this.className} => executeQuery`, err);
    } finally {
      if (conn) {
        await conn.end();
      }
    }
    return res;
  }

  public async executeQueryTransaction<T>(querys: string[], params: Array<string[]>): Promise<T[] | any> {
    let res = null;
    const conn = await (await connect()).getConnection();
    try {

      await conn.beginTransaction();

      querys.forEach(async (query, index) => {
        let result = await conn.query(query, params[index]);
        res.push(result?.[0] ? result[0] : null);
      });

      await conn.commit();
      await conn.end();
      
    } catch (err) {
      await conn.rollback();
      await conn.end();
      console.error(`Error en ${this.className} => executeQueryTransaction`, err);
    } finally {
      if (conn) await conn.end();
    }
    return res;
  }


}

export default CrudRepository;


