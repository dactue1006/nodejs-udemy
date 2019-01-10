const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
  { id: '1', name: 'java'},
  { id: '2', name: 'C#'},
  { id: '3', name: 'Javascript'}
]
app.get('/', (req, res)=> {
  res.send([1, 2, 3]);
})
app.get('/api/courses', (req, res)=> {
  res.send(courses);
})

app.get('/api/courses/:id', (req, res)=> {
  let course = courses.find(c => c.id == req.params.id);
  if (!course) {
    return res.status(404).send("Not found course");
  }
  res.send(course);
})

app.post('/api/courses', (req, res)=> {
  const { error } = validateCourse(req.body);

  if (error) {
    return res.send(error);
  }
  const course = {
    id: courses.length+1,
    name: req.body.name
  }
  courses.push(course);
  res.send(course);
})

app.put('/api/courses/:id', (req, res)=> {
  const course = courses.find(c => c.id == req.params.id);
  if (!course) {
    return res.status(404).send("Id not found")
  }
  const { error } = validateCourse(req.body);
  if (error) {
    return res.send(error);
  }
  course.name = req.body.name;
  res.send(course);
})

app.delete('/api/courses/:id', (req, res)=> {
  const course = courses.find(c => c.id == req.params.id);
  if (!course) return res.status(404).send("Id not found");

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
})
const validateCourse = (course)=> {
  const schema = {
    name: Joi.string().min(3).required()
  }
  return Joi.validate(course, schema);
}

const port = process.env.PORT || 8000;
app.listen(port, ()=>{
  console.log(`Server is running on ${port}`);
})

