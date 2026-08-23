//1.Dependencies
import express from 'express';
import mongoose from 'mongoose';
import flash from 'connect-flash';
import session from 'express-session';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import MongoStore from 'connect-mongo';

//importing DB connection
import connectDB from './db.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



//importing routes
import inventoryRoutes from './routes/inventoryRoutes.mjs';
import authRoutes from './routes/authRoutes.mjs';
import indexRoutes from './routes/indexRoutes.mjs';

//2.Instantiations
const app = express();
const PORT =3000;
const HOST ='localhost';
//3.Configurations
//db configurations
connectDB(); //connect to the database 

//set view engine to pug
app.set("view engine", "pug");//specify the view engine
app.set("views", path.join( __dirname, "views")); //specify the views directory

//4.Middleware

//Middleware to parse form data
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
//how to  use session and flash
app.use(session({
  secret:process.env.SESSION_SECRET,  // || 'defaultsecret',
  resave:false,
  saveUninitialized:false,
  store: MongoStore.create({ 
    mongoUrl: process.env.DATABASE, 
    collectionName: 'sessions',
  }),
   cookie:{
     httpOnly: true,
     secure : false, // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60* 24// 1 day
   }
}));
app.use(flash());

//making a loggedin username and role available to all pug templates
app.use((req,res,next)=>{
  res.locals.user = req.session.userId ?{fullname:req.session.username, role: req.session.userRole}:null;
  res.locals.messages = req.flash();
  next();
})


//5.use imported Routes
app.use('/inventory', inventoryRoutes); //use the inventory routes for any requests starting with inventory
app.use('/',indexRoutes); //use the index routes for the home page
app.use('/',authRoutes); //use the authroutes for any requests starting with /auth
//Handling non-existent routes
//Should always be the last route callback
app.use((req, res) => {
res.status(404).send('Oops! Route not found.');
});

//6.Bootstrapping Server
//Always the last line in this file
app.listen(3000, () => console.log('listening on port 3000')); // new
