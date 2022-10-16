//import mongoose from 'mongoose';
import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js';
import {body} from 'express-validator';
import { validationResultExpress } from '../middlewares/validationResultExpress.js';
const router = Router();
//import Usuario from '../models/User';

router.get("/login", login);

router.post("/register",
  [
    body('email', "Formato de email incorrecto").trim()
    .isEmail()
    .normalizeEmail(),
    body('password', "Deben ser minimo 6 caracteres!")
    .trim()
    .isLength({min: 6}),
    body('password', "Formato de password incorrrecto!")
    .custom((value, {req}) => {
      if(value !== req.body.repassword){
        throw new Error('No coinciden las contraseñas!');
      }
      return value;
    })
  ],
  validationResultExpress, 
  register
);

router.post("/login",
  [
    body('email', "Formato de email incorrecto")
    .trim()
    .isEmail()
    .normalizeEmail(),
    body('password', "Deben ser minimo 6 caracteres!")
    .trim()
    .isLength({min: 6}),
  ],
  validationResultExpress, 
  login
);

export default router;

/* const app = express();

app.get('/', async (req, res) => {
  try {
    const arrayNombres = await Usuario.find();
    
    console.log(arrayNombres);
  } catch (error) {
    console.log(error);
  }
}); */

