const express = require('express');
const cors = require('cors');
// const morgan = require('morgan');
const globalErrorHandler = require('./Utils/errorController');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
app.use(cors());

app.use('/public', express.static(__dirname + '/public'));

app.use(express.json({ exteded: false }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type,      Accept'
  );
  return next();
});

app.use('/api/auth', require('./Routes/api/auth').authRouter);
app.use('/api/users', require('./Routes/api/users'));

app.use('/api/experts', require('./Routes/api/experts'));

app.use(globalErrorHandler);

module.exports = app;
