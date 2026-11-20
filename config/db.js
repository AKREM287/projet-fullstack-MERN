const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL manquant dans le fichier .env");
  }
  const conn = await mongoose.connect(process.env.MONGO_URL);
  console.log(`✔ MongoDB connecté : ${conn.connection.host}/${conn.connection.name}`.cyan);
};

module.exports = connectDB;
