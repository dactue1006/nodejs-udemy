const debug = require('debug')('app:startup');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const app = express();
const courseRouter = require('./routes/course.route');

app.set('view engine', 'pug');
app.set('views', './views'); // default

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`Environment ${app.get('env')}`);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

console.log("your enviroment name", config.get('name'));
console.log("Your mail name", config.get('mail.host'));
console.log("Your mail password", config.get("mail.password"));

if (app.get('env')==='development') {
  app.use(morgan('tiny'));
  debug("morgan is enabled...");
}


app.get('/', (req, res)=> {
  res.render('index', {
    title: 'con cac',
    message: 'hello'
  })
})
app.use('/api/courses', courseRouter);


const port = process.env.PORT || 8000;
app.listen(port, ()=>{
  console.log(`Server is running on ${port}`);
})

