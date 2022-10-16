import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
//const {Schema, model} = mongoose;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: true,
    index: {unique: true},
  },
  password: {
    type: String,
    required: true,
  },
});

/* userSchema tiene varias opciones */

userSchema.pre("save", async function(next){
  const user = this;

  if(!user.isModified('password')) return next();

  try {
    
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(user.password, salt);
  } catch (error) {
    
    console.log(error);
    throw new Error('Fallo el hash de contraseña');
  }
});

//Contraseña con la que esta intentando autenticar el usuario
userSchema.methods.comparePassword = async function(frontendPassword){
  //Compara con la que esta en la base de datos
  return await bcryptjs.compare(frontendPassword, this.password);
};

//MODELO
export const User = mongoose.model('User', userSchema);