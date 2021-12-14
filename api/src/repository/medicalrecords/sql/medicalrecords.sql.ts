export enum MedicalRecordsSql {
  // Obtiene el cliente por su id
  getById = `select * from customers where customerId = ?`,
  // Obtiene las medical_records por el id del cliente
  getMedicalRecordsById = `select * from medical_records where customerId = ?`,
  // Obtiene los procedures por el id
  getProceduresById = `select * from procedures where medical_recordId = ?`,
  // Obtiene los procedures por el id del cliente
  getProceduresByCustomerId = `select * from procedures where medical_recordId = (select id from medical_records where customerId = ? limit 1) order by 1 desc`,
  // Guarda en procedures
  saveProcedure = `insert into procedures (consultation, date, next_appointment, description, price, medical_recordId) values (?, ?, ?, ?, ?, ?)`,
  // Guarda en files
  saveFile = `insert into files (name, type, path, procedureId) values (?, ?, ?, ?)`,
  // Obtiene los files por el id procedures
  getFilesByIdProcedure = `select * from files where procedureId = ?`,
  // Obtiene los files por el id
  getFileById = `select * from files where fileId = ?`,
  // Elimina el files por el id
  deleteFileById = `delete from files where fileId = ?`
}