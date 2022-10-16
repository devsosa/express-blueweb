import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';


export const login = async(req,res) => {
  
  try {
    const {email, password} = req.body;

    let user = await User.findOne({email});
    if(!user) return res.status(403).json({error: "El usuario no existe"});
    
    const validPassword = await user.comparePassword(password);
    if(!validPassword) return res.status(403).json({error: "Contraseña incorrecta"});

    //Generar el token JWT
    //Por temas de seguridad se mantiene el token en memoria
    const token = jwt.sign({uid: user.id}, process.env.JWT_SECRET);
    
    return res.json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: "Error de Servidor!"});
  }
}

export const register = async(req,res) => {
  //console.log(req.body);

  const {email, password} = req.body;

  try {

    
    //Alternativa de validacion buscando por email
    let user = await User.findOne({email});
    
    //throw hace que el codigo salte al catch
    if(user) throw ({code: 11000})
    
    
    user = new User({email, password});
    await user.save();

    //jwt token
    
    return res.status(201).json({ ok: true });
  
  } catch (error) {
    console.log(error.code);

    /* Alternativa de validacion usando moongose */
    if(error.code === 11000){
      return res.status(400).json({error: "YA existe este usuario!"});
    }

    return res.status(500).json({error: "Error de Servidor!"});
  }

  //res.json({ok: 'register'});
}