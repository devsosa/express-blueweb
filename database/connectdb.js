import 'dotenv/config';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;

//app.listen(PORT, () => console.log("🔥🔥🔥 http://localhost:" + PORT));

try {
  await mongoose.connect(process.env.URI_MONGO);
  console.log('Connect DB OK 👋');
} catch (error) {
  console.log('Error de conexion a DB ' + error);
}