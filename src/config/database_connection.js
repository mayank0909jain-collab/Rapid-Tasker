const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;

db.on('connected',()=>{
    console.log("MONGO Connected");
});

db.on('disconnected',()=>{
    console.log("MONGO Disconnected");
});

module.exports = db;