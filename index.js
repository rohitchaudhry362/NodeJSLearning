require('debug')
const Joi = require('joi'); // for input validation
const logger = require('./middleware/logger');
const authenticate = require('./middleware/authentication')
const express = require('express');
const courses = require('./routes/courses');
const genres = require('./routes/genres');
const home = require('./routes/home');

const app = express();

app.set("view engine","pug");
app.set("views","./views");  //default path for views

app.use(express.json());
app.use(express.urlencoded({extended: true})); // key=value&key=value 
app.use(express.static('public'));
app.use('/api/courses', courses);
app.use('/api/genres', genres);
app.use('/', home);

app.use(logger);

app.use(authenticate);



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));