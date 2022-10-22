import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { generateRefreshToken, generateToken } from '../utils/tokenManager.js';


export const login = async(req,res) => {
  
  try {
    const {email, password} = req.body;

    let user = await User.findOne({email});
    if(!user) return res.status(403).json({error: "El usuario no existe"});
    
    const validPassword = await user.comparePassword(password);
    if(!validPassword) return res.status(403).json({error: "Contraseña incorrecta"});

    //Generar el token JWT
    //Por temas de seguridad se mantiene el token en memoria
    //const token = jwt.sign({uid: user.id}, process.env.JWT_SECRET);
    const { token, expiresIn } = generateToken(user.id);

    generateRefreshToken(user.id, res);

    return res.json({ token, expiresIn });
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
};


export const infoUser = async(req,res) => {
  
  //res.json({user: 'correo1@mail.com'});

  try {
    //lean() convierte el objeto enriquesido mongoose en un objeto normal
    const user = await User.findById(req.uid);
    return res.json({email: user.email, uid: user.id});
  
  } catch (error) {
    
    return res.status(500).json({error: "Error de servidor"});
  }
};

export const refreshToken = (req, res) => {

  try {
    
    const refreshTokenCookie = req.cookies.refreshToken;
    if(!refreshTokenCookie) throw new Error("No existe el token");

    const {uid} = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);
    
    const { token, expiresIn } = generateToken(uid);

    return res.json({token, expiresIn});

  } catch (error) {
    console.log(error);
    const tokenVerificationErrors = {
      "invalid signature": "La firma del JWT no es valida",      
      "jwt expired": "JWT expirado",      
      "invalid token": "Token no valido",      
      "No Bearer": "Utiliza formato Bearer",
      "jwt malformed": "JWT formato no valido",      
    };

    return res.status(401).send({error: tokenVerificationErrors[error.message]});
  }
}

export const logout = (req, res) => {

  res.clearCookie("refreshToken");
  res.json({ok: true})

};