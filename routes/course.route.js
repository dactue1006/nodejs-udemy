const express = require('express');
const router = express.Router();
const Joi = require('joi');


const courses = [
  { id: '1', name: 'java'},
  { id: '2', name: 'C#'},
  { id: '3', name: 'Javascript'}
]
router.get('/', (req, res)=> {
  res.send(courses);
})

router.get('/:id', (req, res)=> {
  let course = courses.find(c => c.id == req.params.id);
  if (!course) {
    return res.status(404).send("Not found course");
  }
  res.send(course);
})

router.post('/', (req, res)=> {
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

router.put('/:id', (req, res)=> {
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

router.delete('/:id', (req, res)=> {
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

module.exports = router;