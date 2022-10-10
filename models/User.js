import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const userSchema = new Schema({
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

//MODELO
export const User = model('user', userSchema);