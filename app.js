const express = require('express');
const app = express();
const mongoose = require('mongoose');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

//connect to mongodb
mongoose.connect(process.env.DATABASE,
  {
    useNewUrlParser:true,
    useUnifiedTopology:true
  }
);

//Use morgan for logging http requests to console
if(process.env.NODE_ENV !== 'test'){
  app.use(morgan('dev'));
}

//set uploads to be a public path
app.use('/uploads',express.static('uploads'));

//urlencoded data, don't need rich objects for this
app.use(bodyParser.urlencoded({
  extended:false
}));

//grab JSON off the body
app.use(bodyParser.json());

//add some headers for CORS
app.use((res,req,next)=>{
  res.header('Access-Control-Allow-Origin','*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  //if the user wants to get what options are supported
  if(req.method === 'OPTIONS'){
    req.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }

  next();
});

//Route middleware to handle requests
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/user',userRoutes);

//handle incoming errors - assign properties for message, status
app.use((req,res,next)=>{
  const err = new Error('Not found');
  err.status = 404;
  next(err);
});

//catch all errors
app.use((err,req,res,next)=>{
  res.status(err.status || 500);
  res.json({
    error:{
      message:err.message,
      status:err.status
    }
  });
});

module.exports = app;
