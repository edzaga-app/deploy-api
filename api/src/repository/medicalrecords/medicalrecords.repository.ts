import CrudRepository from "../crud.repository";
import ICustomer from "../../models/customer.interface";
import { MedicalRecordsSql } from './sql/medicalrecords.sql'
import IProcedure from "../../models/procedure.interface";
import { connect } from "../../config/config";
import IMedicalRecord from "../../models/medicalrecord.interface";
import { unlink } from "fs/promises";
import IFileInformation from "../../models/fileinformation.interface";
import fs  from "fs";
import IFile from "../../models/file.interface";
import dotenv from 'dotenv';

dotenv.config();

class MedicalRecordsRepository extends CrudRepository {
  className = 'MedicalRecordsRepository';

  constructor() { 
    super();
  }

  public async deleteFile(id: string): Promise<{ id: string | null}>{
    let res = { id: '0' } || null;
    try {
      const  [ deleteFile, image ]  = await Promise.all([
        this.executeQuery(MedicalRecordsSql.deleteFileById, [id]),
        this.executeQuery<IFile>(MedicalRecordsSql.getFileById, [id])
      ]);
      if(image.length === 0) return res;
      await unlink('./uploads/' + image[0].path);

      res.id = id;
    } catch (error) {
      console.log(error);
    }
    return res;
    
  }

  public async getFiles(id: string): Promise<IFile[] | null> {
    let res: IFile[] = [];
    const images = await this.executeQuery<IFile>(MedicalRecordsSql.getFilesByIdProcedure, [id]);
    if(images.length === 0) return null;
    const directoryPath = './' + 'uploads';
    
    images.map(async (image: IFile) => {
      const filePath = directoryPath + '/' + image.path;
      if (fs.existsSync(filePath)) {
        return res.push({
          fileId: image.fileId,
          name: image.name,
          path: `${process.env.BASE_URL}${image.path}`,
          procedureId: image.procedureId,
          type: image.type
        });
      }
    });
    return res;
  }


  public async getProceduresById(id: string): Promise<IProcedure[] | null>{
    const procedures = await this.executeQuery<IProcedure>(MedicalRecordsSql.getProceduresByCustomerId, [id]);
    return procedures;
  }

  public async saveProcedure(procedure: IProcedure): Promise<{ id: number | string; }> {
    let res = { id: 0 };
    const medicalRecord = await this.getMedicalRecordsById(procedure.customerId.toString());
    if (!medicalRecord) return res; // exception
     
    const insertId = await this.executeQuery<IProcedure>(MedicalRecordsSql.saveProcedure, [
      procedure.consultation,
      procedure.date.toString(),
      procedure.next_appointment.toString(),
      procedure.description,
      procedure.price.toString(),
      medicalRecord.id.toString()
    ]) as any; 
    res.id = insertId?.insertId ?? 0;
    return res;
  }

  public async getCustomersById(id: string): Promise<ICustomer | null> {
    const customer = await this.executeQuery<ICustomer>(MedicalRecordsSql.getById, [id]);
    return customer[0];
  }

  public async uploadImages(procedureId: string, images: IFileInformation[]): Promise<any | null> {
    let res = null;
    try {
      if (!procedureId) {
        throw new Error('No se pudo obtener el id del procedimiento');
      }
      const saveFiles = await this.executeQuery<any>(MedicalRecordsSql.saveFile, [
        images[0].originalname,
        images[0].mimetype,
        images[0].filename,
        procedureId
      ]);
      res = saveFiles;

    } catch (error) {
      console.log(error);
    }
    return res;
  }

  public async uploadImagesProcedure(images: IFileInformation[], procedure: IProcedure): Promise<any | null> {
    let res = null;
    const conn = await (await connect()).getConnection();
    try {

      const medicalRecord = await this.executeQuery<IMedicalRecord>(MedicalRecordsSql.getMedicalRecordsById, [
        procedure.customerId.toString()
      ]);
      if (!medicalRecord[0].id) return res; // exception
      procedure.medical_recordId = medicalRecord[0].id;

      await conn.beginTransaction();
      
      let imageUploaded = procedure.idx;
      let executeProcedure: any = null;
      let procedureId = 0;

      if (imageUploaded != 1 && <number>procedure.quantityOfImages >= imageUploaded) {
        executeProcedure = await this.executeQuery<IProcedure>(MedicalRecordsSql.getProceduresById, [
          procedure.medical_recordId.toString()
        ]);
        procedureId = executeProcedure?.[0].id;
      }

      if (imageUploaded == 1) {
        executeProcedure = await conn.query(MedicalRecordsSql.saveProcedure, [
          procedure.consultation,
          procedure.date,
          procedure.next_appointment,
          procedure.description,
          procedure.price,
          procedure.medical_recordId,
        ]) as any;
        procedureId = executeProcedure?.[0].insertId ?? executeProcedure[0].insertId;
      }

      if (!procedureId) {
        await conn.rollback();
        conn.release();
        return res;
      };

      if(images.length === 0) {
        await conn.commit();
        conn.release();
        res = { procedureId, filesId: false };
        return res;
      }

      const saveImage = await conn.query(MedicalRecordsSql.saveFile, [
        images[0].fieldname,
        images[0].mimetype,
        images[0].path,
        procedureId,
      ]) as any;
      
      res = { procedureId, filesId: saveImage?.[0].insertId ?? true };

      await conn.commit();
      conn.release();
      
    } catch (err) {
      await conn.rollback();
      conn.release();
      this.deleteImagesFromServer(images);
      res = null;
      console.error(`Error en ${this.className} => uploadImagesProcedure`, err);

    } finally {
      if (conn) conn.release();
    }
    return res;

  }

  public async getMedicalRecordsById(customerId: string): Promise<IMedicalRecord | null> {
    const medicalRecord = await this.executeQuery<IMedicalRecord>(MedicalRecordsSql.getMedicalRecordsById, [
      customerId
    ]);
    return medicalRecord[0];
  }

  public async deleteImagesFromServer(images: IFileInformation[]): Promise<void> {
    if(images.length === 0) return;
    images.map(async (image) => {
      await unlink(image['path']);
    });
  }
    


}

export default MedicalRecordsRepository;