import './config/config';
import App from './app';
import AuthController from './controllers/auth.controller';
import MedicalRecordsController from './controllers/medicalrecords.controller';
import CustomerController from './controllers/customer.controller';
import LocationController from './controllers/locationController';

const app = new App([
  new LocationController(),
  new CustomerController(),
  new AuthController(),
  new MedicalRecordsController(),
]);

app.listen();
