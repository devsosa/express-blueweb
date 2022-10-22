import jwt from 'jsonwebtoken';

export const requireAuth =  (req, res, next) => {
  try {
    //let token = req.cookies.token;
    let token = req.headers?.authorization;
    console.log(token);

    if(!token) throw new Error("No existe el token en el header!");

    token = token.split(" ")[1];
    const {uid} = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(payload);
    req.uid = uid;

    next();
  } catch (error) {
    console.log(error.message);

    const tokenVerificationErrors = {
      "invalid signature": "La firma del JWT no es valida",      
      "jwt expired": "JWT expirado",      
      "invalid token": "Token no valido",      
      "No Bearer": "Utiliza formato Bearer",
      "jwt malformed": "JWT formato no valido",      
    }


    return res.status(401).json({error: tokenVerificationErrors[error.message] });
  }
};

/* export const requireAuth =  (req, res, next) => {
  try {
    let token = req.headers?.authorization;
    console.log(token);

    if(!token) throw new Error("No existe el token en el header!");

    token = token.split(" ")[1];
    const {uid} = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(payload);
    req.uid = uid;

    next();
  } catch (error) {
    console.log(error.message);

    const tokenVerificationErrors = {
      "invalid signature": "La firma del JWT no es valida",      
      "jwt expired": "JWT expirado",      
      "invalid token": "Token no valido",      
      "No Bearer": "Utiliza formato Bearer",
      "jwt malformed": "JWT formato no valido",      
    }


    return res.status(401).json({error: tokenVerificationErrors[error.message] });
  }
}; */