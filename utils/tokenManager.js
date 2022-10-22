/* 
  METODO QUE EXPORTA EL TOKEN
*/

import jwt from 'jsonwebtoken';

export const generateToken = (uid) => {
  
  //60 seg por 15 es igual a 15 min
  //Dura poco porque se usara refresh token
  const expiresIn = 60 * 15;
  
  try {
    const token = jwt.sign({uid}, process.env.JWT_SECRET, {expiresIn});
    return {token, expiresIn};

  } catch (error) {
    console.log(error);
  }
}

export const generateRefreshToken = (uid, res) => {
  const expiresIn = 60 * 60 * 24 * 30;

  try {
    const refreshToken = jwt.sign({uid}, process.env.JWT_REFRESH, {expiresIn});
    //Configurar una cookie segura
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: !(process.env.MODO === "developer"),
      expires: new Date(Date.now() + expiresIn * 1000)
    });

  } catch (error) {
    console.log(error);
  }
}