require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const mongoString = process.env.DATABASE_URL;
const vibifyRoutes = require('./routes/vibifyRoutes');
const spotifyRoutes = require('./routes/spotifyRoutes');
const spotifyAuthRoutes = require('./routes/spotifyAuthRoutes');
const session = require('express-session');
mongoose.connect(mongoString);
const app = express();
const database = mongoose.connection;
const crypto = require('crypto');
database.on('error',(error)=>{
   console.log(error);
})

database.once('connected',()=>{
   console.log('Database Connected');
})

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(session({
    secret: crypto.randomBytes(64).toString('hex'),
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));
app.use('/auth',spotifyAuthRoutes)
app.use('/v1/vibify',vibifyRoutes)
app.use('/v1/spotify',spotifyRoutes)

app.listen(8888, ()=>{
    console.log(`Server Started at ${8888}`)

})
