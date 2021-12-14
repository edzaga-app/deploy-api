import { Request, Response, Router } from 'express';
import Auth from '../middlewares/auth';
import Route from '../models/route';
import multer from '../libs/multer';
import IProcedure from '../models/procedure.interface';

import MedicalRecordsRepository from '../repository/medicalrecords/medicalrecords.repository';

class MedicalRecordsController implements Route {
  public path = '/medicalrecords';
  public router = Router();
  private className = 'MedicalRecordsController';
  private authMiddleware = new Auth();
  private medicalRecordsRepository = new MedicalRecordsRepository();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Rutas para las historias clinicas
    this.router.get(`${this.path}/customer/:id`, this.authMiddleware.auth, this.getCustomerById);
    this.router.post(`${this.path}/upload`, [ this.authMiddleware.auth, multer.array('image')], this.uploadImages);
    this.router.post(`${this.path}/procedure/save`, this.authMiddleware.auth, this.saveProcedure);
    this.router.get(`${this.path}/procedures/:id`, this.authMiddleware.auth, this.getProceduresById);
    this.router.get(`${this.path}/files/:id`, this.authMiddleware.auth, this.getFiles);
    this.router.delete(`${this.path}/files/:id`, this.authMiddleware.auth, this.deleteFile);
  }

  private deleteFile = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await this.medicalRecordsRepository.deleteFile(id);
    res.status(200).json(result);
  }

  private getFiles = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const files = await this.medicalRecordsRepository.getFiles(id);
      res.send(files);
    } catch (err) {
      res.status(500).json({ message: 'Ocurrio un error al obteenr los archivos', err});
    }
  }

  private getProceduresById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const procedures = await this.medicalRecordsRepository.getProceduresById(id);
      res.status(200).json(procedures);
    } catch (err) {
      res.status(500).json({
        message: `Error en ${this.className} => getCustomerById`, err
      });
    }
  }
  
  private saveProcedure = async (req: Request, res: Response) => {
    try {
      const procedure = req.body as IProcedure;
      const isSaved = await this.medicalRecordsRepository.saveProcedure(procedure);
      res.send(isSaved);
    } catch (error) {
      res.status(500).json({ message: 'Ocurrio un error al guardar el procedimiento', error});
    }
  }

  private getCustomerById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const customer = await this.medicalRecordsRepository.getCustomersById(id);  
      res.send(customer);
    } catch (err) {
      console.error(`Error en ${this.className} => getCustomerById`, err);
    }
  }

  private uploadImages = async (req: Request, res: Response) => {
    try {
      const images = req.files as [];
      const { procedureId } = req.body;
      const saved = await this.medicalRecordsRepository.uploadImages(procedureId, images);

      //const procedure = req.body as IProcedure;
      // const saved = await this.medicalRecordsRepository.uploadImagesProcedure(images, procedure);
      res.send(saved);
      
    } catch (err) {
      console.error(`Error en ${this.className} => uploadImages`, err);
    }
  }


}

export default MedicalRecordsController;
